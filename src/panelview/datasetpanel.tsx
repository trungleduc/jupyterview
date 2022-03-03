import * as React from 'react';

import { selectorFactory } from '../tools';
import { IControlViewSharedState, IMainViewSharedState } from '../types';

interface IProps {
  clientId: string;
  controlViewState: IControlViewSharedState;
  mainViewState: IMainViewSharedState;
  onSelectDatasetChange: (name: string) => void;
}

interface IStates {
  clientId: string;
  animating: boolean;
  selectedDataset: string;
}

export default class DatasetPanel extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      clientId: this.props.clientId,
      animating: false,
      selectedDataset: ''
    };
  }

  switchDataset = (step = 1) => {
    const fileList = this.props.mainViewState.fileList ?? [];
    const length = fileList.length;
    if (length < 2) {
      return;
    }
    const current = this.props.controlViewState.selectedDataset!;
    const idx = fileList.indexOf(current);
    if (idx === -1) {
      return;
    }
    let next = idx + step;
    if (next == length) {
      next = 0;
    } else if (next < 0) {
      next = length - 1;
    }

    this.props.onSelectDatasetChange(fileList[next]);
  };

  toggleAnimation = () => {
    this.setState(old => {
      const current = old.animating;
      if (!current) {
        this._interval = setInterval(this.switchDataset, 200);
      } else {
        clearInterval(this._interval);
      }
      return { ...old, animating: !current };
    });
  };

  render(): React.ReactNode {
    const fileList = (this.props.mainViewState.fileList ?? ['None']).map(
      item => ({ label: item.split('::')[0], value: item })
    );

    return (
      <div className="jpview-control-panel-component">
        {selectorFactory({
          defaultValue:
            this.props.controlViewState.selectedDataset ?? fileList[0].value,
          options: fileList,
          onChange: e => this.props.onSelectDatasetChange(e.target.value),
          label: 'Dataset'
        })}
        <div
          style={{
            margin: '3px 3px 5px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <button
            style={{ width: '25%' }}
            className="jpview-button"
            title="Previous"
            onClick={() => this.switchDataset(-1)}
          >
            Previous
          </button>
          <button
            style={{ width: '25%' }}
            className="jpview-button"
            title="Play"
            onClick={this.toggleAnimation}
          >
            {this.state.animating ? 'Pause' : 'Play'}
          </button>
          <button
            style={{ width: '25%' }}
            className="jpview-button"
            title="Next"
            onClick={() => this.switchDataset(1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  private _interval: any;
}
