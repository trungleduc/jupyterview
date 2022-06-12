import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';

import * as React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';

import { Signal } from '@lumino/signaling';

import { JupyterViewModel } from './model';

import { MainView } from './mainview';
import { ParserManager } from '../reader/manager';
import { IBaseViewModel } from '../types';
import { MainViewModel } from './mainviewmodel';

export class JupyterViewWidget extends DocumentWidget<
  JupyterViewPanel,
  JupyterViewModel
> {
  constructor(
    options: DocumentWidget.IOptions<JupyterViewPanel, JupyterViewModel>
  ) {
    super(options);
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this.content.dispose();
    super.dispose();
    setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
  }

  onResize = (msg: any): void => {
    window.dispatchEvent(new Event('resize'));
  };
}

export class JupyterViewPanel extends ReactWidget {
  /**
   * Construct a `ExamplePanel`.
   *
   * @param context - The documents context.
   */
  constructor(
    context: DocumentRegistry.IContext<JupyterViewModel>,
    private parsers: ParserManager
  ) {
    super();
    this.addClass('jp-jupyterview-panel');
    this._context = context;
    this._model = new MainViewModel({
      context,
      parserManager: this.parsers,
      kernel: context.model.getKernel()
    });
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    Signal.clearData(this);
    super.dispose();
  }

  render(): JSX.Element {
    return <MainView model={this._model} />;
  }

  private _context: DocumentRegistry.IContext<JupyterViewModel>;
  private _model: IBaseViewModel;
}
