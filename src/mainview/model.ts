import { DocumentRegistry } from '@jupyterlab/docregistry';

import { IModelDB, ModelDB } from '@jupyterlab/observables';

import { ISignal, Signal } from '@lumino/signaling';

import { PartialJSONObject } from '@lumino/coreutils';

import { IChangedArgs } from '@jupyterlab/coreutils';

import { YDocument, MapChange } from '@jupyterlab/shared-models';

import { IControlViewSharedState, IDict, IMainViewSharedState, Position } from '../types';

import * as Y from 'yjs';

export class JupyterViewModel implements DocumentRegistry.IModel {
  constructor(languagePreference?: string, modelDB?: IModelDB) {
    this.modelDB = modelDB || new ModelDB();
    this.sharedModel.awareness.on('change', this._onCameraChanged);
    console.log('clientID', this.sharedModel.awareness.clientID);
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
    this._readOnly = value;
  }

  toString(): string {
    const content = this.sharedModel.getContent('content') || '';
    return content;
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
    console.log('');
  }

  initialize(): void {
    // nothing to do
  }

  getWorker(): Worker {
    // if (!JupyterViewModel.worker) {
    //   JupyterViewModel.worker = new Worker(
    //     new URL('./worker', (import.meta as any).url)
    //   );
    // }
    return JupyterViewModel.worker;
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

  readonly defaultKernelName: string = '';
  readonly defaultKernelLanguage: string = '';
  readonly modelDB: IModelDB;
  readonly sharedModel = JupyterViewDoc.create();

  private _dirty = false;
  private _readOnly = false;
  private _isDisposed = false;
  private _contentChanged = new Signal<this, void>(this);
  private _stateChanged = new Signal<this, IChangedArgs<any>>(this);
  private _themeChanged = new Signal<this, IChangedArgs<any>>(this);
  private _cameraChanged = new Signal<this, Map<number, any>>(this);
  static worker: Worker;
}

export type JupyterViewDocChange = {
  contextChange?: MapChange;
  contentChange?: string;
  mainViewStateChange?: IDict;
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
    const ret: IMainViewSharedState = {}
    for (const key of this._mainViewState.keys()) {
      ret[key] = this._mainViewState.get(key)
    }
    return ret;
  }
  public getMainViewStateByKey(key: string): IMainViewSharedState {
    return this._mainViewState.get(key)
  }

  public setMainViewState(key: keyof IMainViewSharedState, value: any): void {
    this._mainViewState.set(key, value);
  }

  public getControlViewState(): IControlViewSharedState {
    const ret: IControlViewSharedState = {}
    for (const key of this._controlViewState.keys()) {
      ret[key] = this._controlViewState.get(key)
    }
    return ret;
  }
  public getControlViewStateByKey(key: string): IControlViewSharedState {
    return this._controlViewState.get(key)
  }

  public setControlViewState(key: keyof IControlViewSharedState, value: any): void {
    this._controlViewState.set(key, value);
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
  private _controlViewStateChanged = new Signal<this, IControlViewSharedState>(this);
}
