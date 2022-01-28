import {
    WidgetTracker,
  } from '@jupyterlab/apputils';
import { JupyterViewWidget } from './mainview/widget';
import { IVtkTracker } from './token';

export class VtkTracker extends WidgetTracker<JupyterViewWidget> implements IVtkTracker {

}