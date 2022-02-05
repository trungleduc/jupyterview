import * as React from 'react';
import { refreshIcon, LabIcon } from '@jupyterlab/ui-components';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JupyterViewDoc, JupyterViewDocChange } from '../mainview/model';
import {
  IControlViewSharedState,
  IMainViewSharedState,
  ValueOf
} from '../types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { debounce, selectorFactory } from '../tools';

interface IProps {
  filePath?: string;
  sharedModel?: JupyterViewDoc;
}

interface IStates {
  panel1: boolean;
  panel2: boolean;
  panel3: boolean;
  mainViewState: IMainViewSharedState;
  controlViewState: IControlViewSharedState;
}
const panelTitleStyle = {
  background: 'var(--jp-layout-color2)',
  color: 'var(--jp-ui-font-color1)'
};
const panelBodyStyle = {
  color: 'var(--jp-ui-font-color1)',
  background: 'var(--jp-layout-color1)',
  padding: '8px'
};
const DISPLAY_MODE = [
  { label: 'Surface', value: '1:2:0' },
  { label: 'Surface with Edge', value: '1:2:1' },
  { label: 'Wireframe', value: '1:1:0' },
  { label: 'Points', value: '1:0:0' },
  { label: 'Hidden', value: '0:-1:0' }
];
export default class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this._defaultColorMap = 'erdc_rainbow_bright';
    this.updateSharedState = debounce(
      (
        key: keyof IControlViewSharedState,
        value: ValueOf<IControlViewSharedState>
      ) => {
        if (this.props.sharedModel) {
          this.props.sharedModel.setControlViewState(key, value);
        }
      },
      100
    ) as any;
    this.state = {
      panel1: true,
      panel2: true,
      panel3: true,
      mainViewState: {},
      controlViewState: {
        selectedColor: ':',
        colorSchema: this._defaultColorMap,
        displayMode: DISPLAY_MODE[0].value,
        opacity: 1
      }
    };
    this.onSharedModelPropChange(this.props.sharedModel);
    this._colorMapOptions = (vtkColorMaps.rgbPresetNames as string[]).map(
      option => ({ value: option, label: option })
    );
  }

  componentWillUnmount(): void {
    if (this.props.sharedModel) {
      this.props.sharedModel.mainViewStateChanged.disconnect(
        this.sharedMainViewModelChanged
      );
    }
  }

  componentDidUpdate(oldProps, oldState): void {
    if (oldProps.sharedModel === this.props.sharedModel) {
      return;
    }
    if (oldProps.sharedModel) {
      oldProps.sharedModel.changed.disconnect(this.sharedMainViewModelChanged);
    }
    this.onSharedModelPropChange(this.props.sharedModel);
  }

  onSharedModelPropChange(sharedModel?: JupyterViewDoc): void {
    if (sharedModel) {
      sharedModel.mainViewStateChanged.connect(this.sharedMainViewModelChanged);
      this.setState(old => {
        const controlViewState = sharedModel.getControlViewState();
        controlViewState.selectedColor = controlViewState.selectedColor ?? ':';
        return {
          ...old,
          mainViewState: sharedModel.getMainViewState(),
          controlViewState
        };
      });
    }
  }

  sharedMainViewModelChanged = (_, changed: IMainViewSharedState): void => {
    this.setState(old => {
      const newState = {
        ...old,
        mainViewState: { ...old.mainViewState, ...changed }
      };
      if (changed.dataRange) {
        newState.controlViewState.modifiedDataRange = [...changed.dataRange];
      }
      return newState;
    });
  };

  togglePanel = (panel: 'panel1' | 'panel2' | 'panel3'): void => {
    this.setState(old => ({ ...old, [panel]: !old[panel] }));
  };

  onSelectedColorChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = evt.target.value;
    this.updateLocalAndSharedState('selectedColor', value);
  };

  onColorSchemaChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = evt.target.value;
    this.updateLocalAndSharedState('colorSchema', value);
  };

  onRangeChange = (option: 'min' | 'max', value: string): void => {
    if (!this.state.controlViewState.modifiedDataRange) {
      return;
    }
    const index = { min: 0, max: 1 };
    const newRange = [...this.state.controlViewState.modifiedDataRange!];
    newRange[index[option]] = parseFloat(value);
    this.updateLocalAndSharedState('modifiedDataRange', newRange);
  };

  resetRange = (): void => {
    const newRange = this.props.sharedModel?.getMainViewStateByKey('dataRange');
    if (newRange) {
      this.updateLocalAndSharedState('modifiedDataRange', newRange);
    }
  };

  onDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const displayMode = e.target.value;
    this.updateLocalAndSharedState('displayMode', displayMode);
  };

  onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const opacity = parseFloat(e.target.value);
    this.updateLocalAndSharedState('opacity', opacity);
  };

  updateLocalAndSharedState = (
    key: keyof IControlViewSharedState,
    value: ValueOf<IControlViewSharedState>
  ): void => {
    this.setState(old => ({
      ...old,
      controlViewState: {
        ...old.controlViewState,
        [key]: value
      }
    }));
    this.updateSharedState(key, value);
  };

  rangeSettingComponent = (): JSX.Element => {
    let dataRangeBlock = <div></div>;
    if (this.state.controlViewState.modifiedDataRange) {
      const step =
        (this.state.controlViewState.modifiedDataRange[1] -
          this.state.controlViewState.modifiedDataRange[0]) /
        100;
      dataRangeBlock = (
        <div className="jpview-input-wrapper">
          <div style={{ width: '40%' }}>
            <label>Min</label>
            <input
              className="jpview-input"
              type="number"
              value={this.state.controlViewState.modifiedDataRange[0]}
              onChange={e => this.onRangeChange('min', e.target.value)}
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
              onClick={this.resetRange}
            >
              {LabIcon.resolveReact({ icon: refreshIcon })}
            </button>
          </div>
          <div style={{ width: '40%' }}>
            <label>Max</label>
            <input
              className="jpview-input"
              type="number"
              value={this.state.controlViewState.modifiedDataRange[1]}
              onChange={e => this.onRangeChange('max', e.target.value)}
              step={step}
            />
          </div>
        </div>
      );
    }
    return dataRangeBlock;
  };

  render(): JSX.Element {
    const colorSelectorData = this.state.mainViewState.colorByOptions ?? [
      { value: ':', label: 'Solid color' }
    ];

    return (
      <div className="jpview-control-panel">
        <div className="lm-Widget p-Widget jpview-control-panel-title">
          <h2>{this.props.filePath}</h2>
        </div>
        <Accordion expanded={this.state.panel2}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel2')}
          >
            <span>Display</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            {selectorFactory({
              defaultValue: this.state.controlViewState.displayMode,
              options: DISPLAY_MODE,
              onChange: this.onDisplayModeChange,
              label: 'Display mode'
            })}
            <div className="jpview-input-wrapper">
              <div style={{ width: '100%' }}>
                <label>Opacity: {this.state.controlViewState.opacity}</label>
                <input
                  className="jpview-slider"
                  type="range"
                  name="opacity"
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={this.state.controlViewState.opacity}
                  onChange={this.onOpacityChange}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={this.state.panel1}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel1')}
          >
            <span className="lm-Widget">Color</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle} className={'lm-Widget'}>
            {selectorFactory({
              defaultValue: this.state.controlViewState.selectedColor,
              options: colorSelectorData,
              onChange: this.onSelectedColorChange,
              label: 'Color by'
            })}
            {selectorFactory({
              defaultValue: this.state.controlViewState.colorSchema,
              options: this._colorMapOptions,
              onChange: this.onColorSchemaChange,
              label: 'Color map option'
            })}
            {this.rangeSettingComponent()}
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={this.state.panel3}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel3')}
          >
            <span>Disabled Accordion</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </span>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  _colorMapOptions: { value: string; label: string }[];
  _defaultColorMap: string;
  updateSharedState: (
    key: keyof IControlViewSharedState,
    value: ValueOf<IControlViewSharedState>
  ) => void;
}
