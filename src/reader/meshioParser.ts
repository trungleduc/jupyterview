import { KernelExecutor } from '../kernel';
import { IJupyterViewParser, IParserResult } from './types';

export class MeshIOParser implements IJupyterViewParser {
  readonly supportedType: string[] = [
    'msh',
    'f3grid',
    'mdpa',
    'ply',
    'stl',
    'xdmf',
    'xmf',
    'cgns',
    'h5m',
    'inp',
    'avs',
    'xml',
    'e',
    'exo',
    'ex2',
    'hmf',
    'med',
    'mesh',
    'meshb',
    'bdf',
    'fem',
    'nas',
    'vol',
    'vol.gz',
    'obj',
    'off',
    'post',
    'post.gz',
    'dato',
    'dato.gz',
    'su2',
    'svg',
    'dat',
    'tec',
    'ele',
    'node',
    'ugrid',
    'wkt'
  ];
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
