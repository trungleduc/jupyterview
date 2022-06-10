import {
  Kernel,
  KernelMessage,
  ServiceManager,
  Session
} from '@jupyterlab/services';
import { find } from '@lumino/algorithm';
import { UUID } from '@lumino/coreutils';
import { IDisposable } from '@lumino/disposable';

const KERNEL_NAME = 'JupyterView Kernel';

export class KernelExecutor implements IDisposable {
  constructor(private options: KernelExecutor.IOptions) {
    this._kernelStarted = false;
  }

  async startKernel(): Promise<void> {
    if (this._kernelStarted) {
      return;
    }
    const sessionManager = this.options.manager.sessions;
    await sessionManager.ready;
    await sessionManager.refreshRunning();
    const model = find(sessionManager.running(), item => {
      return item.name === KERNEL_NAME;
    });

    if (model) {
      this._sessionConnection = sessionManager.connectTo({ model });
    } else {
      await this.options.manager.kernelspecs.ready;
      const specs = this.options.manager.kernelspecs.specs!;
      this._sessionConnection = await sessionManager.startNew({
        name: KERNEL_NAME,
        path: UUID.uuid4(),
        kernel: {
          name: specs.default
        },
        type: 'notebook'
      });
      const kernelModel = {
        name: specs.kernelspecs[specs.default]!.name
      } as Kernel.IModel;
      await this._sessionConnection.changeKernel(kernelModel);
    }
    this._sessionConnection.kernel?.disposed.connect(
      () => (this._kernelStarted = false)
    );
    this._kernelStarted = true;
  }

  codeGenerator(filePath: string): string {
    const writeFile = `
      try:
        import piplite
        await piplite.install('meshio')
      except:
        pass
      import base64,  meshio, tempfile 
      mesh = meshio.read("${filePath}")
      c = tempfile.NamedTemporaryFile()
      try:
        ext = 0
        mesh.write(c.name,'vtu')
      except:
        ext = 1
        mesh.write(c.name,'vtk')
      with open(c.name,'rb') as f:
          content = f.read()
      c.close()
      try:
        os.remove("${filePath}")
      except:
        pass
      base64_bytes = base64.b64encode(content)
      {ext: base64_bytes}
      `;
    return writeFile;
  }

  fileGenerator(
    filePath: string,
    content: string
  ): { ext: string; code: string } {
    const ext = filePath.split('.').pop() as string;
    const code = `
    import base64, tempfile
    tempPath = tempfile.NamedTemporaryFile(suffix=".${ext}",delete=False)
    message = """${content}"""
    base64_bytes = message.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    with open(tempPath.name, 'wb') as f:
      f.write(message_bytes)
    tempPath.name
    `;
    return { ext, code };
  }

  async executeCode(
    code: KernelMessage.IExecuteRequestMsg['content']
  ): Promise<string> {
    const kernel = this._sessionConnection?.kernel;
    if (!kernel) {
      throw new Error('Session has no kernel.');
    }
    return new Promise<string>((resolve, reject) => {
      const future = kernel.requestExecute(code, false, undefined);
      future.onIOPub = (msg: KernelMessage.IIOPubMessage): void => {
        const msgType = msg.header.msg_type;
        if (msgType === 'execute_result') {
          const content = (msg as KernelMessage.IExecuteResultMsg).content.data[
            'text/plain'
          ] as string;
          resolve(content);
        } else if (msgType === 'error') {
          console.error('Kernel operation failed', msg.content);
          reject(msg.content);
        }
      };
    });
  }
  async convertFile(
    filePath: string,
    fileContent: string
  ): Promise<{ type: string; binary: string }> {
    const stopOnError = true;
    let path = filePath;
    let format: string | undefined;
    const kernel = this._sessionConnection?.kernel;
    if (!kernel) {
      throw new Error('Session has no kernel.');
    }

    if (this.options.jupyterLite) {
      const fileGeneratorCode = this.fileGenerator(filePath, fileContent);
      const tempPath = await this.executeCode({ code: fileGeneratorCode.code });
      path = tempPath.slice(1, -1);
      format = fileGeneratorCode.ext;
    }
    const code = this.codeGenerator(path);
    const content: KernelMessage.IExecuteRequestMsg['content'] = {
      code,
      stop_on_error: stopOnError
    };

    const promise: Promise<{ type: string; binary: string }> = this.executeCode(
      content
    ).then(content => {
      const type = content[1] === '0' ? 'vtu' : 'vtk';
      const binary = content.slice(6, -2);
      return { type, binary };
    });

    return promise;
  }

  dispose(): void {
    this._sessionConnection.dispose();
  }

  isDisposed: boolean;
  // private _sessionContext: ISessionContext;
  private _sessionConnection: Session.ISessionConnection;
  private _kernelStarted: boolean;
}

export namespace KernelExecutor {
  export interface IOptions {
    manager: ServiceManager;
    jupyterLite: boolean;
  }
}
