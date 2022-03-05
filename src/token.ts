import { IWidgetTracker } from '@jupyterlab/apputils';
import { JupyterViewWidget } from './mainview/widget';
import { Token } from '@lumino/coreutils';
import { ISignal } from '@lumino/signaling';
export interface IVtkTracker extends IWidgetTracker<JupyterViewWidget> {
  widgetDisposed: ISignal<this, JupyterViewWidget>;
}

export const IJupyterViewDocTracker = new Token<IVtkTracker>(
  'jupyterViewDocTracker'
);
