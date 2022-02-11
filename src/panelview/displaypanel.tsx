import * as React from 'react';
import {
  IControlViewSharedState,
} from '../types';

import { selectorFactory } from '../tools';

export const DISPLAY_MODE = [
  { label: 'Surface', value: '1:2:0' },
  { label: 'Surface with Edge', value: '1:2:1' },
  { label: 'Wireframe', value: '1:1:0' },
  { label: 'Points', value: '1:0:0' },
  { label: 'Hidden', value: '0:-1:0' }
];

interface IProps {
  clientId: string;
  controlViewState: IControlViewSharedState;
  onDisplayModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IStates {
  clientId: string;
}

export default class DisplayPanel extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props)
    this.state = { clientId: this.props.clientId };
  }

  render(): React.ReactNode {
    return (
      <div  className='jpview-control-panel-component'>
        {selectorFactory({
          defaultValue: this.props.controlViewState.displayMode,
          options: DISPLAY_MODE,
          onChange: this.props.onDisplayModeChange,
          label: 'Display mode'
        })}
        <div className="jpview-input-wrapper">
          <div style={{ width: '100%' }}>
            <label>Opacity: {this.props.controlViewState.opacity}</label>
            <input
              className="jpview-slider"
              type="range"
              name="opacity"
              min={0.01}
              max={1}
              step={0.01}
              value={this.props.controlViewState.opacity}
              onChange={this.props.onOpacityChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
