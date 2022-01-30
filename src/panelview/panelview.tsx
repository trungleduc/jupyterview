import * as React from 'react';
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
  padding: '8px 0px 8px 16px'
};
export default class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      panel1: true,
      panel2: true,
      panel3: true,
      mainViewState: {},
      controlViewState: { selectedColor: ':' }
    };
    this.updateSharedState(this.props.sharedModel);
  }

  componentWillUnmount() {
    if (this.props.sharedModel) {
      this.props.sharedModel.mainViewStateChanged.disconnect(
        this.sharedModelChanged
      );
    }
  }

  componentDidUpdate(oldProps, oldState) {
    console.log('state', this.state);

    if (oldProps.sharedModel === this.props.sharedModel) {
      return;
    }
    if (oldProps.sharedModel) {
      oldProps.sharedModel.changed.disconnect(this.sharedModelChanged);
    }
    this.updateSharedState(this.props.sharedModel);
  }

  updateSharedState(sharedModel?: JupyterViewDoc) {
    if (sharedModel) {
      sharedModel.mainViewStateChanged.connect(this.sharedModelChanged);
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

  private sharedModelChanged = (_, changed: IMainViewSharedState) => {
    this.setState(
      old => ({ ...old, mainViewState: changed }),
      () => {
        console.log(this.state);
      }
    );
  };

  private togglePanel = (panel: 'panel1' | 'panel2' | 'panel3') => {
    this.setState(old => ({ ...old, [panel]: !old[panel] }));
  };

  private onSelectedColorChange = (evt: SelectChangeEvent<string>) => {
    const value = evt.target.value;
    if (this.props.sharedModel) {
      this.props.sharedModel.setControlViewState('selectedColor', value);
    }
    this.setState(old => ({
      ...old,
      controlViewState: { ...old.controlViewState, selectedColor: value }
    }));
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
            <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={this.state.controlViewState.selectedColor}
                onChange={this.onSelectedColorChange}
                autoWidth
              >
                {colorSelectorData.map(option => (
                  <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
}
