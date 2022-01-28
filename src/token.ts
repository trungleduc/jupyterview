import { IWidgetTracker } from '@jupyterlab/apputils';
import { JupyterViewWidget } from './mainview/widget';
import { Token } from '@lumino/coreutils';

export interface IVtkTracker extends IWidgetTracker<JupyterViewWidget> {}

export const IJupyterViewDocTracker = new Token<IVtkTracker>(
  'jupyterViewDocTracker'
);
