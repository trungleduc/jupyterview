import { KernelExecutor } from '../kernel';

export interface IJupyterViewParser {
  supportedType: string[];
  nativeSupport: boolean;
  readFile(
    fileContent: string,
    fileExtension: string,
    fullPath?: string,
    kernel?: KernelExecutor
  ): Promise<IParserResult>;
}

export interface IParserResult {
  type: string;
  binary: string;
}
