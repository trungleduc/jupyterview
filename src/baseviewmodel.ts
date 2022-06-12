import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';

import { ContentsManager } from '@jupyterlab/services';

import { KernelExecutor } from './kernel';
import { ParserManager } from './reader/manager';
import { IParserResult } from './reader/types';
import { b64_to_utf8 } from './tools';
import { IBaseViewModel } from './types';

export abstract class BaseViewModel implements IBaseViewModel {
  protected _parserManager: ParserManager;
  protected _kernel: KernelExecutor;
  constructor(options: BaseViewModel.IOptions) {
    this._parserManager = options.parserManager;
    this._kernel = options.kernel;
  }
  prepareFileContent(
    filePath: string,
    fileName: string,
    fileContent
  ): { [key: string]: Promise<IParserResult> } {
    const pathList = fileName.split('.');
    const ext = pathList[pathList.length - 1];
    const promises: { [key: string]: Promise<IParserResult> } = {};
    if (ext.toLowerCase() === 'pvd') {
      const xmlStr = b64_to_utf8(fileContent);
      const xmlParser = new DOMParser();
      const doc = xmlParser.parseFromString(xmlStr, 'application/xml');
      const contents = new ContentsManager();
      doc.querySelectorAll('DataSet').forEach(item => {
        const timeStep = item.getAttribute('timestep');
        const vtuPath = item.getAttribute('file');
        const content: Promise<IParserResult> = contents
          .get(`${filePath}/${vtuPath}`, {
            format: 'base64',
            content: true,
            type: 'file'
          })
          .then(iModel => ({ type: 'vtu', binary: iModel.content }));
        promises[`${vtuPath}::${filePath}::${timeStep}`] = content;
      });
      return promises;
    } else {
      const fileExt = ext.toLowerCase();
      const path = `${filePath}${fileName}`;
      const parser = this._parserManager.getParser(fileExt);
      if (!parser) {
        throw Error('Parser not found');
      }
      const content = parser.readFile(fileContent, fileExt, path, this._kernel);
      let output: string;
      if (parser.nativeSupport) {
        output = `${fileName}::${filePath}::0::${fileName}`;
      } else {
        output = `${fileName}.vtk::${filePath}::0::${fileName}`;
      }
      return { [output]: content };
    }
  }

  async stringToPolyData(fileContent: string, filePath: string): Promise<any> {
    const str = `data:application/octet-stream;base64,${fileContent}`;
    return fetch(str)
      .then(b => b.arrayBuffer())
      .then(buff => readPolyDataArrayBuffer(null, buff, filePath, ''))
      .then(polyResult => {
        polyResult.webWorker.terminate();
        return polyResult;
      });
  }

  abstract ready: Promise<void>;
  abstract contentPromises(): { [key: string]: Promise<IParserResult> };
}

export namespace BaseViewModel {
  export interface IOptions {
    parserManager: ParserManager;
    kernel: KernelExecutor;
  }
}
