import * as React from 'react';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { v4 as uuid } from 'uuid';
import { JupyterViewModel } from './model';

import {
  IMainMessage,
  IWorkerMessage,
  WorkerAction,
  MainAction
} from './types';

type THEME_TYPE = 'JupyterLab Dark' | 'JupyterLab Light';
const DARK_THEME: THEME_TYPE = 'JupyterLab Dark';
const LIGHT_THEME: THEME_TYPE = 'JupyterLab Light';

const BG_COLOR = {
  [DARK_THEME]: 'linear-gradient(rgb(0, 0, 42), rgb(82, 87, 110))',
  [LIGHT_THEME]: 'radial-gradient(#efeded, #8f9091)'
};

interface IProps {
  context: DocumentRegistry.IContext<JupyterViewModel>;
}

interface IStates {
  id: string;
  loading: boolean;
  theme: THEME_TYPE;
}

export class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      id: uuid(),
      theme: LIGHT_THEME,
      loading: true
    };
    this._context = props.context;
    this._context.ready.then(() => {
      this._model = this._context.model as JupyterViewModel;
      this._worker = this._model.getWorker();
      this._messageChannel = new MessageChannel();
      this._messageChannel.port1.onmessage = msgEvent => {
        this.messageHandler(msgEvent.data);
      };
      this.postMessage(
        { action: WorkerAction.REGISTER, payload: { id: this.state.id } },
        this._messageChannel.port2
      );
    });
  }

  messageHandler = (msg: IMainMessage): void => {
    switch (msg.action) {
      case MainAction.INITIALIZED: {
        this.postMessage({
          action: WorkerAction.LOAD_FILE,
          payload: {
            fileName: this._context.path,
            content: this._model!.toString()
          }
        });
      }
    }
  };

  private postMessage = (
    msg: Omit<IWorkerMessage, 'id'>,
    port?: MessagePort
  ) => {
    if (this._worker) {
      const newMsg = { ...msg, id: this.state.id };
      if (port) {
        this._worker.postMessage(newMsg, [port]);
      } else {
        this._worker.postMessage(newMsg);
      }
    }
  };

  render(): JSX.Element {
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100%)'
        }}
      >
        <div
          className={'jpview-Spinner'}
          style={{ display: this.state.loading ? 'flex' : 'none' }}
        >
          {' '}
          <div className={'jpview-SpinnerContent'}></div>{' '}
        </div>
        <div
          ref={this.divRef}
          style={{
            width: '100%',
            height: 'calc(100%)',
            background: BG_COLOR[this.state.theme] //"radial-gradient(#efeded, #8f9091)"
          }}
        />
      </div>
    );
  }

  private divRef = React.createRef<HTMLDivElement>(); // Reference of render div
  private _context: DocumentRegistry.IContext<JupyterViewModel>;
  private _model: JupyterViewModel | undefined;
  private _worker?: Worker = undefined;
  private _messageChannel?: MessageChannel;
}
