import { IWidgetTracker } from '@jupyterlab/apputils';
import { JupyterViewWidget } from './mainview/widget';
import { Token } from '@lumino/coreutils';

export type IVtkTracker = IWidgetTracker<JupyterViewWidget>;

export const IJupyterViewDocTracker = new Token<IVtkTracker>(
  'jupyterViewDocTracker'
);
