import {
  ISessionContext,
  SessionContext,
  sessionContextDialogs
} from '@jupyterlab/apputils';

import { KernelMessage, ServiceManager } from '@jupyterlab/services';
import { IDisposable } from '@lumino/disposable';

export class KernelExecutor implements IDisposable {
  constructor(options: KernelExecutor.IOptions) {
    console.log(options);
    this._sessionContext = new SessionContext({
      sessionManager: options.manager.sessions,
      specsManager: options.manager.kernelspecs,
      name: 'Kernel Output'
    });
  }

  get session(): ISessionContext {
    return this._sessionContext;
  }
  dispose(): void {
    console.log('dispose');
  }

  isDisposed: boolean;
  private _sessionContext: ISessionContext;
}

export namespace KernelExecutor {
  export interface IOptions {
    manager: ServiceManager;
  }
}
