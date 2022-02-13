import * as React from 'react';
import {
  IControlViewSharedState,
} from '../types';

import { selectorFactory } from '../tools';


interface IProps {
  clientId: string;
  controlViewState: IControlViewSharedState;
}

interface IStates {
  clientId: string;
}

export default class DatasetPanel extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props)
    this.state = { clientId: this.props.clientId };
  }

  render(): React.ReactNode {
    return (
      <div className='jpview-control-panel-component'>
        hello
      </div>
    );
  }
}
