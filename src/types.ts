import { ISignal } from '@lumino/signaling';
import { KernelExecutor } from './kernel';
import { JupyterViewDoc } from './mainview/model';
import { ParserManager } from './reader/manager';
import { IParserResult } from './reader/types';

export interface IDict<T = any> {
  [key: string]: T;
}

export type ValueOf<T> = T[keyof T];

/**
 * Action definitions for main thread
 */
export enum MainAction {
  DISPLAY_SHAPE = 'DISPLAY_SHAPE',
  INITIALIZED = 'INITIALIZED'
}

export interface IDisplayShape {
  action: MainAction.DISPLAY_SHAPE;
  payload: {
    edgeList: any;
    faceList: any;
  };
}
export interface IWorkerInitialized {
  action: MainAction.INITIALIZED;
  payload: boolean;
}

export type IMainMessage = IDisplayShape | IWorkerInitialized;

export type Position = {
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  z: number;
  clientID?: number;
};

export interface IMainViewSharedState {
  colorByOptions?: { value: string; label: string }[];
  dataRange?: number[];
  fileList?: string[];
  camera?: {
    focalPoint: number[];
    position: number[];
    viewUp: number[];
  };
}
export interface IControlViewSharedState {
  selectedColor?: string;
  colorSchema?: string;
  modifiedDataRange?: number[];
  displayMode?: string;
  opacity?: number;
  enableWarp?: boolean;
  warpFactor?: number;
  warpNormal?: boolean;
  warpNormalAxis?: number[];
  selectedWarp?: string;
  selectedDataset?: string;
}

export interface IBaseViewModel {
  ready: Promise<void>;
  controlViewStateChanged?: ISignal<any, IControlViewSharedState>;
  mainViewStateChanged?: ISignal<any, IMainViewSharedState>;
  sharedModel?: JupyterViewDoc;
  contentPromises(): {
    [key: string]: Promise<IParserResult>;
  };
  prepareFileContent(
    filePath: string,
    fileName: string,
    fileContent
  ): { [key: string]: Promise<IParserResult> };
  stringToPolyData(fileContent: string, filePath: string): Promise<any>;
}
