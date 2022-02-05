import * as React from 'react';
import { refreshIcon, LabIcon } from '@jupyterlab/ui-components';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JupyterViewDoc, JupyterViewDocChange } from '../mainview/model';
import { IControlViewSharedState, IMainViewSharedState } from '../types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps';
import { selectorFactory } from '../tools';

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
export default class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this._defaultColorMap = 'erdc_rainbow_bright';

    this.state = {
      panel1: true,
      panel2: true,
      panel3: true,
      mainViewState: {},
      controlViewState: {
        selectedColor: ':',
        colorSchema: this._defaultColorMap
      }
    };
    this.updateSharedState(this.props.sharedModel);
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
    this.updateSharedState(this.props.sharedModel);
  }

  updateSharedState(sharedModel?: JupyterViewDoc): void {
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
    if (this.props.sharedModel) {
      this.props.sharedModel.setControlViewState('selectedColor', value);
    }
    this.setState(old => ({
      ...old,
      controlViewState: { ...old.controlViewState, selectedColor: value }
    }));
  };

  onColorSchemaChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = evt.target.value;
    if (this.props.sharedModel) {
      this.props.sharedModel.setControlViewState('colorSchema', value);
    }
    this.setState(old => ({
      ...old,
      controlViewState: { ...old.controlViewState, colorSchema: value }
    }));
  };

  onRangeChange = (option: 'min' | 'max', value: string): void => {
    if (!this.state.controlViewState.modifiedDataRange) {
      return;
    }
    const index = { min: 0, max: 1 };
    const newRange = [...this.state.controlViewState.modifiedDataRange!];
    newRange[index[option]] = parseFloat(value);
    this.setState(old => ({
      ...old,
      controlViewState: {
        ...old.controlViewState,
        modifiedDataRange: newRange
      }
    }));
    if (this.props.sharedModel) {
      this.props.sharedModel.setControlViewState('modifiedDataRange', newRange);
    }
  };

  resetRange = (): void => {
    const newRange = this.props.sharedModel?.getMainViewStateByKey('dataRange');
    if (newRange) {
      this.setState(old => ({
        ...old,
        controlViewState: {
          ...old.controlViewState,
          modifiedDataRange: newRange
        }
      }));
      if (this.props.sharedModel) {
        this.props.sharedModel.setControlViewState(
          'modifiedDataRange',
          newRange
        );
      }
    }
  };

  rangeSettingComponent = (): JSX.Element => {
    let dataRangeBlock = <div></div>;
    if (this.state.controlViewState.modifiedDataRange) {
      const step =
        (this.state.controlViewState.modifiedDataRange[1] -
          this.state.controlViewState.modifiedDataRange[0]) /
        10;
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
        <Accordion expanded={this.state.panel2}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('panel2')}
          >
            <span>Accordion 2</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </span>
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
}
