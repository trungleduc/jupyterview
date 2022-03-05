import { WidgetTracker } from '@jupyterlab/apputils';
import { JupyterViewWidget } from './mainview/widget';
import { IVtkTracker } from './token';
import { ISignal, Signal } from '@lumino/signaling';
export class VtkTracker
  extends WidgetTracker<JupyterViewWidget>
  implements IVtkTracker
{
  add(widget: JupyterViewWidget): Promise<void> {
    widget.disposed.connect(() => {
      this._widgetDisposed.emit(widget);
    });
    return super.add(widget);
  }
  get widgetDisposed(): ISignal<this, JupyterViewWidget> {
    return this._widgetDisposed;
  }

  private _widgetDisposed = new Signal<this, JupyterViewWidget>(this);
}
