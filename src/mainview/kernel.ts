import {
  ISessionContext,
  SessionContext,
  sessionContextDialogs
} from '@jupyterlab/apputils';
import { toArray } from '@lumino/algorithm';
import { KernelMessage, ServiceManager, Kernel } from '@jupyterlab/services';
import { IDisposable } from '@lumino/disposable';
import { Resolver } from 'dns';

const KERNEL_NAME = 'JupyterView Kernel';

export class KernelExecutor implements IDisposable {
  constructor(options: KernelExecutor.IOptions) {
    this._sessionContext = new SessionContext({
      sessionManager: options.manager.sessions,
      specsManager: options.manager.kernelspecs,
      name: KERNEL_NAME
    });
    this._kernelStarted = false;
  }

  async startKernel(): Promise<void> {
    if (this._kernelStarted) {
      return;
    }
    const value = await this._sessionContext.initialize();
    if (value) {
      await this._sessionContext.specsManager.ready;
      const running = toArray(this._sessionContext.sessionManager.running());
      let kernelModel: Kernel.IModel | undefined = undefined;
      for (const iterator of running) {
        if (iterator.name === KERNEL_NAME) {
          kernelModel = iterator.kernel!;
        }
      }
      if (!kernelModel) {
        const specs = this._sessionContext.specsManager.specs!;
        kernelModel = {
          name: specs.kernelspecs[specs.default]!.name
        } as Kernel.IModel;
      }
      await this._sessionContext.changeKernel(kernelModel);
      this._kernelStarted = true;
    }
  }

  codeGenerator(filePath: string): string {
    const writeFile = `
      import base64,  meshio, tempfile 
      mesh = meshio.read("${filePath}")
      c = tempfile.NamedTemporaryFile()
      mesh.write(c.name,'vtu')
      with open(c.name,'rb') as f:
          content = f.read()
      c.close()
      base64_bytes = base64.b64encode(content)
      base64_bytes
      `;
    return writeFile;
  }

  async execute(filePath: string): Promise<string> {
    const stopOnError = true;
    const code = this.codeGenerator(filePath);
    const content: KernelMessage.IExecuteRequestMsg['content'] = {
      code,
      stop_on_error: stopOnError
    };
    const kernel = this._sessionContext.session?.kernel;
    if (!kernel) {
      throw new Error('Session has no kernel.');
    }
    const promise = new Promise<string>((resolve, reject) => {
      const future = kernel.requestExecute(content, false, undefined);
      future.onIOPub = (msg: KernelMessage.IIOPubMessage): void => {
        const msgType = msg.header.msg_type;
        if (msgType === 'execute_result') {
          const content = (msg as KernelMessage.IExecuteResultMsg).content.data[
            'text/plain'
          ] as string;
          resolve(content.slice(2, -1));
        }
      };
    });

    return promise;
  }

  get session(): ISessionContext {
    return this._sessionContext;
  }
  dispose(): void {
    console.log('dispose');
  }

  isDisposed: boolean;
  private _sessionContext: ISessionContext;
  private _kernelStarted: boolean;
}

export namespace KernelExecutor {
  export interface IOptions {
    manager: ServiceManager;
  }
}
