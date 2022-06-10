import { IJupyterViewParser } from './types';

export class ParserManager {
  private _parser: Map<string, IJupyterViewParser>;
  constructor() {
    this._parser = new Map();
  }
  registerParser(parser: IJupyterViewParser) {
    parser.supportedType.forEach(ext => {
      if (!this._parser.has(ext)) {
        this._parser.set(ext, parser);
      }
    });
  }
  get parser(): Map<string, IJupyterViewParser> {
    return this._parser;
  }

  supportedFormat(): string[] {
    return Array.from(this._parser.keys());
  }

  getParser(ext: string): IJupyterViewParser | undefined {
    return this._parser.get(ext);
  }
}
