import * as React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { JupyterViewDoc } from '../mainview/model';
import { debounce } from '../tools';
import {
  IControlViewSharedState,
  IMainViewSharedState,
  ValueOf
} from '../types';
import ColorPanel from './colorpanel';
import DatasetPanel from './datasetpanel';
import DisplayPanel, { DISPLAY_MODE } from './displaypanel';
import WrapPanel from './wrappanel';

interface IProps {
  filePath?: string;
  sharedModel?: JupyterViewDoc;
}

interface IStates {
  datasetPanel: boolean;
  colorPanel: boolean;
  displayPanel: boolean;
  filterPanel: boolean;
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

const STOCK_STATE = {
  datasetPanel: true,
  colorPanel: true,
  displayPanel: true,
  filterPanel: true,
  mainViewState: {},
  controlViewState: {
    selectedColor: ':',
    colorSchema: 'erdc_rainbow_bright',
    displayMode: DISPLAY_MODE[0].value,
    opacity: 1
  }
};

export default class MainPanelView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.updateSharedState = debounce((payload: IControlViewSharedState) => {
      if (this.props.sharedModel) {
        this.props.sharedModel.setControlViewState(payload);
      }
    }, 100) as any;
    this.state = STOCK_STATE;
    this.onSharedModelPropChange(this.props.sharedModel);
  }

  componentWillUnmount(): void {
    if (this.props.sharedModel) {
      this.props.sharedModel.mainViewStateChanged.disconnect(
        this.sharedMainViewModelChanged
      );
      this.props.sharedModel.controlViewStateChanged.disconnect(
        this.sharedControlViewModelChanged
      );
    }
  }

  componentDidUpdate(oldProps, oldState): void {
    if (oldProps.sharedModel === this.props.sharedModel) {
      return;
    }
    if (oldProps.sharedModel) {
      oldProps.sharedModel.changed.disconnect(this.sharedMainViewModelChanged);
      oldProps.sharedModel.controlViewStateChanged.disconnect(
        this.sharedControlViewModelChanged
      );
    }
    this.onSharedModelPropChange(this.props.sharedModel);
  }

  onSharedModelPropChange(sharedModel?: JupyterViewDoc): void {
    if (sharedModel) {
      sharedModel.mainViewStateChanged.connect(this.sharedMainViewModelChanged);
      sharedModel.controlViewStateChanged.connect(
        this.sharedControlViewModelChanged
      );
      this.setState(old => {
        const controlViewState = sharedModel.getControlViewState();
        const mainViewState = sharedModel.getMainViewState();

        controlViewState.selectedColor = controlViewState.selectedColor ?? ':';
        controlViewState.modifiedDataRange =
          controlViewState.modifiedDataRange ?? mainViewState.dataRange;
        return {
          ...old,
          mainViewState,
          controlViewState
        };
      });
    } else {
      this.setState(old => STOCK_STATE);
    }
  }

  sharedControlViewModelChanged = (
    _,
    changed: IControlViewSharedState
  ): void => {
    this.setState(old => ({
      ...old,
      controlViewState: { ...old.controlViewState, ...changed }
    }));
  };
  sharedMainViewModelChanged = (_, changed: IMainViewSharedState): void => {
    this.setState(old => {
      const newState = {
        ...old,
        mainViewState: { ...old.mainViewState, ...changed }
      };
      if (changed.dataRange) {
        newState.controlViewState.modifiedDataRange = [...changed.dataRange];
      }
      if (changed.fileList) {
        newState.controlViewState.selectedDataset = changed.fileList[0];
      }
      return newState;
    });
  };

  togglePanel = (
    panel: 'datasetPanel' | 'colorPanel' | 'displayPanel' | 'filterPanel'
  ): void => {
    this.setState(old => ({ ...old, [panel]: !old[panel] }));
  };

  onSelectedColorChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedColor = evt.target.value;
    this.updateLocalAndSharedState({ selectedColor });
  };

  onColorSchemaChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const colorSchema = evt.target.value;
    this.updateLocalAndSharedState({ colorSchema });
  };

  onRangeChange = (option: 'min' | 'max', value: string): void => {
    if (!this.state.controlViewState.modifiedDataRange) {
      return;
    }
    const index = { min: 0, max: 1 };
    const modifiedDataRange = [
      ...this.state.controlViewState.modifiedDataRange!
    ];
    modifiedDataRange[index[option]] = parseFloat(value);
    this.updateLocalAndSharedState({ modifiedDataRange });
  };

  resetRange = (): void => {
    const selectedColor = this.state.controlViewState.selectedColor;
    if (selectedColor) {
      this.updateLocalAndSharedState({ selectedColor });
    }
  };

  onDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const displayMode = e.target.value;
    this.updateLocalAndSharedState({ displayMode });
  };

  onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const opacity = parseFloat(e.target.value);
    this.updateLocalAndSharedState({ opacity });
  };

  onWarpActivationChange = (enableWarp: boolean): void => {
    this.updateLocalAndSharedState({ enableWarp });
  };
  onWarpFactorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const warpFactor = parseFloat(e.target.value);
    this.updateLocalAndSharedState({ warpFactor });
  };

  onSelectedWarpChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedWarp = e.target.value;
    const enableWarp = e.target.value !== ':';
    const warpFactor = 0;
    this.updateLocalAndSharedState({ selectedWarp, enableWarp, warpFactor });
  };

  onWarpUseNormalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const warpNormal = e.target.checked;
    const payload = { warpNormal };
    if (!warpNormal) {
      payload['warpNormalAxis'] = [0, 0, 1];
    }
    this.updateLocalAndSharedState(payload);
  };

  onWarpNormalAxisChange = (warpNormalAxis: number[]): void => {
    this.updateLocalAndSharedState({ warpNormalAxis });
  };

  onSelectDatasetChange = (selectedDataset: string): void => {
    this.updateLocalAndSharedState({ selectedDataset });
  };

  updateLocalAndSharedState = (payload: IControlViewSharedState): void => {
    this.setState(old => ({
      ...old,
      controlViewState: {
        ...old.controlViewState,
        ...payload
      }
    }));
    this.updateSharedState(payload);
  };

  render(): JSX.Element {
    return (
      <div className="jpview-control-panel">
        <div className="lm-Widget p-Widget jpview-control-panel-title">
          <h2>{this.props.filePath}</h2>
        </div>
        <Accordion
          expanded={this.state.datasetPanel}
          sx={{ margin: '0px 0px' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="dataSetPanela-content"
            id="displayPanela-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('datasetPanel')}
          >
            <span>Dataset</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <DatasetPanel
              clientId={this.props.filePath}
              controlViewState={this.state.controlViewState}
              mainViewState={this.state.mainViewState}
              onSelectDatasetChange={this.onSelectDatasetChange}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={this.state.displayPanel}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="displayPanela-content"
            id="displayPanela-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('displayPanel')}
          >
            <span>Display</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <DisplayPanel
              clientId=""
              onOpacityChange={this.onOpacityChange}
              onDisplayModeChange={this.onDisplayModeChange}
              controlViewState={this.state.controlViewState}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={this.state.colorPanel}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="colorPanela-content"
            id="colorPanela-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('colorPanel')}
          >
            <span className="lm-Widget">Color</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle} className={'lm-Widget'}>
            <ColorPanel
              clientId=""
              controlViewState={this.state.controlViewState}
              mainViewState={this.state.mainViewState}
              onRangeChange={this.onRangeChange}
              resetRange={this.resetRange}
              onColorSchemaChange={this.onColorSchemaChange}
              onSelectedColorChange={this.onSelectedColorChange}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={this.state.filterPanel}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filterPanela-content"
            id="filterPanela-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel('filterPanel')}
          >
            <span>Warp by scalar</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <WrapPanel
              clientId=""
              controlViewState={this.state.controlViewState}
              onWarpActivationChange={this.onWarpActivationChange}
              onWarpFactorChange={this.onWarpFactorChange}
              mainViewState={this.state.mainViewState}
              onSelectedWarpChange={this.onSelectedWarpChange}
              onWarpUseNormalChange={this.onWarpUseNormalChange}
              onWarpNormalAxisChange={this.onWarpNormalAxisChange}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  updateSharedState: (payload: IControlViewSharedState) => void;
}
