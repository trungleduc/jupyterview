import { IJupyterViewParser } from './types';

export class ParserManager {
  private _parser: { [key: string]: IJupyterViewParser };
  constructor() {
    this._parser = {};
  }
  registerParser(parser: IJupyterViewParser) {
    parser.supportedType.forEach(ext => {
      if (!(ext in this._parser)) {
        this._parser[ext] = parser;
      }
    });
  }
  get parser(): { [key: string]: IJupyterViewParser } {
    return this._parser;
  }
  supportedFormat(): string[] {
    return Object.keys(this._parser);
  }
}
