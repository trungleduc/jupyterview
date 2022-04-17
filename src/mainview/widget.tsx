import { DocumentRegistry, DocumentWidget } from '@jupyterlab/docregistry';

import * as React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';

import { Signal } from '@lumino/signaling';

import { JupyterViewModel } from './model';

import { MainView } from './mainview';
import { IJupyterViewParser } from '../reader/types';

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
    private parsers: { [key: string]: IJupyterViewParser }
  ) {
    super();
    this.addClass('jp-jupyterview-panel');
    this._context = context;
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
    return <MainView context={this._context} parsers={this.parsers} />;
  }

  private _context: DocumentRegistry.IContext<JupyterViewModel>;
}
