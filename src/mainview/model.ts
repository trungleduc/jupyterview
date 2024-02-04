import { DocumentRegistry } from '@jupyterlab/docregistry';

import { ISignal, Signal } from '@lumino/signaling';

import { PartialJSONObject } from '@lumino/coreutils';

import { IChangedArgs } from '@jupyterlab/coreutils';

import { YDocument, MapChange, StateChange } from '@jupyter/ydoc';

import {
  IControlViewSharedState,
  IDict,
  IMainViewSharedState,
  Position
} from '../types';

import * as Y from 'yjs';
import { KernelExecutor } from '../kernel';

interface IOptions {
  sharedModel?: JupyterViewDoc;
  languagePreference?: string;
}

export class JupyterViewModel implements DocumentRegistry.IModel {
  constructor(options: IOptions) {
    const { sharedModel } = options;
    if (sharedModel) {
      this._sharedModel = sharedModel;
    } else {
      this._sharedModel = JupyterViewDoc.create();
    }

    this._sharedModel.awareness.on('change', this._onCameraChanged);
  }

  readonly collaborative = false;

  get sharedModel(): JupyterViewDoc {
    return this._sharedModel;
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get contentChanged(): ISignal<this, void> {
    return this._contentChanged;
  }

  get stateChanged(): ISignal<this, IChangedArgs<any, any, string>> {
    return this._stateChanged;
  }

  get themeChanged(): Signal<
    this,
    IChangedArgs<string, string | null, string>
  > {
    return this._themeChanged;
  }

  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  get dirty(): boolean {
    return this._dirty;
  }
  set dirty(value: boolean) {
    this._dirty = value;
  }

  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(value: boolean) {
    this._readOnly = true;
  }

  toString(): string {
    const content = this.sharedModel.getContent('content');
    if (content && content.length > 0) {
      return content;
    } else {
      throw Error('Content not found');
    }
  }

  fromString(data: string): void {
    this.sharedModel.transact(() => {
      this.sharedModel.setContent('content', data);
    });
  }

  toJSON(): PartialJSONObject {
    return {};
  }

  fromJSON(data: PartialJSONObject): void {
    /** */
  }

  initialize(): void {
    this.sharedModel.setContent(
      'backup',
      this.sharedModel.getContent('content')
    );
  }

  syncCamera(pos: Position | undefined): void {
    this.sharedModel.awareness.setLocalStateField('mouse', pos);
  }

  getClientId(): number {
    return this.sharedModel.awareness.clientID;
  }

  get cameraChanged(): ISignal<this, Map<number, any>> {
    return this._cameraChanged;
  }

  private _onCameraChanged = () => {
    const clients = this.sharedModel.awareness.getStates();
    this._cameraChanged.emit(clients);
  };

  getKernel(): KernelExecutor {
    return JupyterViewModel.kernel;
  }

  readonly defaultKernelName: string = '';
  readonly defaultKernelLanguage: string = '';
  readonly _sharedModel: JupyterViewDoc;

  private _dirty = false;
  private _readOnly = true;
  private _isDisposed = false;
  private _contentChanged = new Signal<this, void>(this);
  private _stateChanged = new Signal<this, IChangedArgs<any>>(this);
  private _themeChanged = new Signal<this, IChangedArgs<any>>(this);
  private _cameraChanged = new Signal<this, Map<number, any>>(this);

  static kernel: KernelExecutor;
}

export type JupyterViewDocChange = {
  contextChange?: MapChange;
  contentChange?: string;
  mainViewStateChange?: IDict;
  stateChange?: StateChange<any>[];
};

export class JupyterViewDoc extends YDocument<JupyterViewDocChange> {
  constructor() {
    super();
    this._content = this.ydoc.getMap('content');
    this._mainViewState = this.ydoc.getMap('mainViewState');
    this._mainViewState.observe(this._mainViewStateObserver);
    this._controlViewState = this.ydoc.getMap('controlViewState');
    this._controlViewState.observe(this._controlViewStateObserver);
  }

  /**
   * Document version
   */
  readonly version: string = '1.0.0';

  dispose(): void {
    this._mainViewState.unobserve(this._mainViewStateObserver);
    this._controlViewState.unobserve(this._controlViewStateObserver);
  }

  public static create(): JupyterViewDoc {
    return new JupyterViewDoc();
  }

  public get mainViewStateChanged() {
    return this._mainViewStateChanged;
  }

  public get controlViewStateChanged() {
    return this._controlViewStateChanged;
  }

  public getContent(key: string): any {
    return this._content.get(key);
  }

  public setContent(key: string, value: any): void {
    this._content.set(key, value);
  }

  public getMainViewState(): IMainViewSharedState {
    const ret: IMainViewSharedState = {};
    for (const key of this._mainViewState.keys()) {
      ret[key] = this._mainViewState.get(key);
    }
    return ret;
  }
  public getMainViewStateByKey(key: keyof IMainViewSharedState): any {
    return this._mainViewState.get(key);
  }

  public setMainViewState(payload: IMainViewSharedState): void {
    this.transact(() => {
      for (const key in payload) {
        this._mainViewState.set(key, payload[key]);
      }
    });
  }

  public getControlViewState(): IControlViewSharedState {
    const ret: IControlViewSharedState = {};
    for (const key of this._controlViewState.keys()) {
      ret[key] = this._controlViewState.get(key);
    }
    return ret;
  }
  public getControlViewStateByKey(key: keyof IControlViewSharedState): any {
    return this._controlViewState.get(key);
  }

  public setControlViewState(payload: IControlViewSharedState): void {
    this.transact(() => {
      for (const key in payload) {
        this._controlViewState.set(key, payload[key]);
      }
    });
  }

  private _mainViewStateObserver = (event: Y.YMapEvent<any>): void => {
    const changes: IMainViewSharedState = {};
    event.keysChanged.forEach(key => {
      changes[key] = this.getMainViewStateByKey(key);
    });
    this._mainViewStateChanged.emit(changes);
  };

  private _controlViewStateObserver = (event: Y.YMapEvent<any>): void => {
    const changes: IControlViewSharedState = {};
    event.keysChanged.forEach(key => {
      changes[key] = this.getControlViewStateByKey(key);
    });
    this._controlViewStateChanged.emit(changes);
  };

  private _content: Y.Map<any>;
  private _mainViewState: Y.Map<any>;
  private _mainViewStateChanged = new Signal<this, IMainViewSharedState>(this);
  private _controlViewState: Y.Map<any>;
  private _controlViewStateChanged = new Signal<this, IControlViewSharedState>(
    this
  );
}
