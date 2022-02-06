import * as React from 'react';
import { refreshIcon, LabIcon } from '@jupyterlab/ui-components';
import { IControlViewSharedState, IMainViewSharedState } from '../types';

import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { selectorFactory } from '../tools';

interface IProps {
  clientId: string;
  controlViewState: IControlViewSharedState;
  mainViewState: IMainViewSharedState;
  onRangeChange: (option: 'min' | 'max', value: string) => void;
  resetRange: () => void;
  onSelectedColorChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  onColorSchemaChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface IStates {
  clientId: string;
}

export default class ColorPanel extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = { clientId: this.props.clientId };
    this._colorMapOptions = (vtkColorMaps.rgbPresetNames as string[]).map(
      option => ({ value: option, label: option })
    );
  }

  rangeSettingComponent = (): JSX.Element => {
    let dataRangeBlock = <div></div>;
    if (this.props.controlViewState.modifiedDataRange) {
      const step =
        (this.props.controlViewState.modifiedDataRange[1] -
          this.props.controlViewState.modifiedDataRange[0]) /
        100;
      dataRangeBlock = (
        <div className="jpview-input-wrapper">
          <div style={{ width: '40%' }}>
            <label>Min</label>
            <input
              className="jpview-input"
              type="number"
              value={this.props.controlViewState.modifiedDataRange[0]}
              onChange={e => this.props.onRangeChange('min', e.target.value)}
              step={step}
            />
          </div>
          <div
            style={{
              width: '15%',
              display: 'flex',
              flexDirection: 'column-reverse'
            }}
          >
            <button
              className="jp-Button jpview-toolbar-button"
              title="Reset range"
              onClick={this.props.resetRange}
            >
              {LabIcon.resolveReact({ icon: refreshIcon })}
            </button>
          </div>
          <div style={{ width: '40%' }}>
            <label>Max</label>
            <input
              className="jpview-input"
              type="number"
              value={this.props.controlViewState.modifiedDataRange[1]}
              onChange={e => this.props.onRangeChange('max', e.target.value)}
              step={step}
            />
          </div>
        </div>
      );
    }
    return dataRangeBlock;
  };

  render(): React.ReactNode {
    const colorSelectorData = this.props.mainViewState.colorByOptions ?? [
      { value: ':', label: 'Solid color' }
    ];
    return (
      <div>
        {selectorFactory({
          defaultValue: this.props.controlViewState.selectedColor,
          options: colorSelectorData,
          onChange: this.props.onSelectedColorChange,
          label: 'Color by'
        })}
        {selectorFactory({
          defaultValue: this.props.controlViewState.colorSchema,
          options: this._colorMapOptions,
          onChange: this.props.onColorSchemaChange,
          label: 'Color map option'
        })}
        {this.rangeSettingComponent()}
      </div>
    );
  }
  private _colorMapOptions: { value: string; label: string }[];
}
