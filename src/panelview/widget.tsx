import * as React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';
import PanelView from './panelview';
import { IVtkTracker } from '../token';

export class PanelWidget extends ReactWidget {
  constructor(tracker: IVtkTracker) {
    super();
    this._tracker = tracker;
    tracker.currentChanged.connect((_, changed) => {
      if (changed) {
        const name = changed.context.localPath;
        console.log('name', name);
      }
    });
  }

  dispose(): void {
    super.dispose();
  }

  render(): JSX.Element {
    return <PanelView />;
  }
  private _tracker: IVtkTracker;
}
