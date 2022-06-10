import { KernelExecutor } from '../kernel';
import { IJupyterViewParser, IParserResult } from './types';

export class MeshIOParser implements IJupyterViewParser {
  readonly supportedType: string[] = ['inp', 'msh', 'vol', 'med', 'xml'];
  nativeSupport: false;
  readFile(
    fileContent: string,
    fileExtension: string,
    fullPath?: string,
    kernel?: KernelExecutor
  ): Promise<IParserResult> {
    if (!this.supportedType.includes(fileExtension)) {
      throw Error('Not supported file');
    }
    if (!kernel) {
      throw Error('Kernel is required for this file');
    }
    if (!fullPath) {
      throw Error('Full path is required for this file');
    }

    const content = kernel.startKernel().then(() => {
      const result = kernel.convertFile(fullPath, fileContent);
      return result;
    });
    return content;
  }
}
