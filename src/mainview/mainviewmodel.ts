import {
  IBaseViewModel,
  IControlViewSharedState,
  IMainViewSharedState
} from '../types';

import { DocumentRegistry } from '@jupyterlab/docregistry';
import { JupyterViewDoc, JupyterViewModel } from './model';
import { BaseViewModel } from '../baseviewmodel';
import { ISignal } from '@lumino/signaling';
import { convertPath } from '../tools';
import { IParserResult } from '../reader/types';

interface IOptions extends BaseViewModel.IOptions {
  context: DocumentRegistry.IContext<JupyterViewModel>;
}

export class MainViewModel extends BaseViewModel implements IBaseViewModel {
  private _context: DocumentRegistry.IContext<JupyterViewModel>;
  private _sharedModel: JupyterViewDoc;
  constructor(options: IOptions) {
    super(options);
    this._context = options.context;
    this._sharedModel = this._context.model.sharedModel;
    this.ready = this._context.ready;
    this.controlViewStateChanged = this._sharedModel.controlViewStateChanged;
    this.mainViewStateChanged = this._sharedModel.mainViewStateChanged;
  }

  contentPromises(): { [key: string]: Promise<IParserResult> } {
    const fullPath = convertPath(this._context.path);
    const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
    const fileName = fullPath.replace(/^.*(\\|\/|:)/, '');

    const fileContent = this._sharedModel.getContent('content');
    const contentPromises = this.prepareFileContent(
      dirPath,
      fileName,
      fileContent
    );
    return contentPromises
  }

  get sharedModel(): JupyterViewDoc {
    return this._sharedModel
  };

  controlViewStateChanged: ISignal<any, IControlViewSharedState>;
  mainViewStateChanged: ISignal<any, IMainViewSharedState>;
  ready: Promise<void>;
}
