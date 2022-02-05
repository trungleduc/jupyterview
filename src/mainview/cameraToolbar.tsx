import {
  caretDownIcon,
  caretRightIcon,
  Collapse,
  InputGroup,
  jupyterIcon,
  listingsInfoIcon,
  refreshIcon
} from '@jupyterlab/ui-components';
import * as React from 'react';

interface IProps {
  rotateHandler: (dir: 'left' | 'right') => () => void;
  resetCamera: () => void;
  updateOrientation: (dir: 'x' | 'y' | 'z') => void;
}

interface IStates {}

export class CameraToolbar extends React.Component<IProps, IStates> {
  render(): JSX.Element {
    return (
      <div className="jpview-view-toolbar">
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Reset zoom level"
          onClick={this.props.resetCamera}
        >
          <span>
            <i className="fa fa-bullseye"></i>
          </span>
        </button>
        <span></span> <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Rotate camera left 90°"
          onClick={this.props.rotateHandler('left')}
        >
          <span>
            <i className="fa fa-rotate-left"></i>
          </span>
        </button>{' '}
        <span></span>
        <button
          className="jp-Button jpview-toolbar-button dark"
          title="Rotate camera right 90°"
          onClick={this.props.rotateHandler('right')}
        >
          <span>
            <i className="fa fa-rotate-right"></i>
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
