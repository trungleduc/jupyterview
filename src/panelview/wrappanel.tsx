import * as React from 'react';
import { IControlViewSharedState } from '../types';
import Switch from '@mui/material/Switch';
interface IProps {
  clientId: string;
  controlViewState: IControlViewSharedState;
}

interface IStates {
  clientId: string;
}

export default class WrapPanel extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = { clientId: this.props.clientId };
  }

  render(): React.ReactNode {
    return (
      <div
        style={{
          display: 'flex',
          margin: '2px 2px 5px',
          justifyContent: 'space-between'
        }}
      >
        <label>Activate</label>
        <Switch size="small" />
      </div>
    );
  }
}
