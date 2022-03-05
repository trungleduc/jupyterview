import * as React from 'react';

import { focusViewIcon, rotateLeftIcon, rotateRightIcon } from '../tools';

interface IProps {
  rotateHandler: (dir: 'left' | 'right') => () => void;
  resetCamera: () => void;
  updateOrientation: (dir: 'x' | 'y' | 'z') => void;
}

export class CameraToolbar extends React.Component<IProps> {
  render(): JSX.Element {
    return (
      <div className="jpview-view-toolbar">
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Reset zoom level"
          onClick={this.props.resetCamera}
        >
          <span>
            <focusViewIcon.react />
          </span>
        </button>
        <span></span> <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Rotate camera left 90°"
          onClick={this.props.rotateHandler('left')}
        >
          <span>
            <rotateLeftIcon.react />
          </span>
        </button>{' '}
        <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Rotate camera right 90°"
          onClick={this.props.rotateHandler('right')}
        >
          <span>
            <rotateRightIcon.react />
          </span>
        </button>{' '}
        <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Move camera to X-Direction"
          onClick={() => this.props.updateOrientation('x')}
        >
          <span>X</span>
        </button>{' '}
        <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Move camera to Y-Direction"
          onClick={() => this.props.updateOrientation('y')}
        >
          <span>Y</span>
        </button>{' '}
        <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Move camera to Z-Direction"
          onClick={() => this.props.updateOrientation('z')}
        >
          <span>Z</span>
        </button>
      </div>
    );
  }
}
