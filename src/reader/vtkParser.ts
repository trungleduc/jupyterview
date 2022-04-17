import { IJupyterViewParser, IParserResult } from './types';

export class VtkParser implements IJupyterViewParser {
  readonly supportedType: string[] = ['vtu', 'vtk', 'vtp'];
  nativeSupport = true;
  readFile(fileContent: string, fileExtension: string): Promise<IParserResult> {
    if (!this.supportedType.includes(fileExtension)) {
      throw Error('Not supported file');
    }
    return Promise.resolve({ binary: fileContent, type: fileExtension });
  }
}
