import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { JupyterViewDoc } from "../mainview/model";
import {
  IControlViewSharedState,
  IMainViewSharedState,
  ValueOf
} from "../types";
import { debounce } from "../tools";
import DisplayPanel, { DISPLAY_MODE } from "./displaypanel";
import ColorPanel from "./colorpanel";
import WrapPanel from "./wrappanel";

interface IProps {
  filePath?: string;
  sharedModel?: JupyterViewDoc;
}

interface IStates {
  colorPanel: boolean;
  displayPanel: boolean;
  filterPanel: boolean;
  mainViewState: IMainViewSharedState;
  controlViewState: IControlViewSharedState;
}
const panelTitleStyle = {
  background: "var(--jp-layout-color2)",
  color: "var(--jp-ui-font-color1)"
};
const panelBodyStyle = {
  color: "var(--jp-ui-font-color1)",
  background: "var(--jp-layout-color1)",
  padding: "8px"
};

export default class MainView extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this._defaultColorMap = "erdc_rainbow_bright";
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
      colorPanel: true,
      displayPanel: true,
      filterPanel: true,
      mainViewState: {},
      controlViewState: {
        selectedColor: ":",
        colorSchema: this._defaultColorMap,
        displayMode: DISPLAY_MODE[0].value,
        opacity: 1
      }
    };
    this.onSharedModelPropChange(this.props.sharedModel);
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
        controlViewState.selectedColor = controlViewState.selectedColor ?? ":";
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

  togglePanel = (
    panel: "colorPanel" | "displayPanel" | "filterPanel"
  ): void => {
    this.setState(old => ({ ...old, [panel]: !old[panel] }));
  };

  onSelectedColorChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = evt.target.value;
    this.updateLocalAndSharedState("selectedColor", value);
  };

  onColorSchemaChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = evt.target.value;
    this.updateLocalAndSharedState("colorSchema", value);
  };

  onRangeChange = (option: "min" | "max", value: string): void => {
    if (!this.state.controlViewState.modifiedDataRange) {
      return;
    }
    const index = { min: 0, max: 1 };
    const newRange = [...this.state.controlViewState.modifiedDataRange!];
    newRange[index[option]] = parseFloat(value);
    this.updateLocalAndSharedState("modifiedDataRange", newRange);
  };

  resetRange = (): void => {
    const newRange = this.props.sharedModel?.getMainViewStateByKey("dataRange");
    if (newRange) {
      this.updateLocalAndSharedState("modifiedDataRange", newRange);
    }
  };

  onDisplayModeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const displayMode = e.target.value;
    this.updateLocalAndSharedState("displayMode", displayMode);
  };

  onOpacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const opacity = parseFloat(e.target.value);
    this.updateLocalAndSharedState("opacity", opacity);
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

  render(): JSX.Element {
    return (
      <div className="jpview-control-panel">
        <div className="lm-Widget p-Widget jpview-control-panel-title">
          <h2>{this.props.filePath}</h2>
        </div>
        <Accordion expanded={this.state.displayPanel}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="displayPanela-content"
            id="displayPanela-header"
            sx={panelTitleStyle}
            onClick={() => this.togglePanel("displayPanel")}
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
            onClick={() => this.togglePanel("colorPanel")}
          >
            <span className="lm-Widget">Color</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle} className={"lm-Widget"}>
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
            onClick={() => this.togglePanel("filterPanel")}
          >
            <span>Warp by scalar</span>
          </AccordionSummary>
          <AccordionDetails sx={panelBodyStyle}>
            <WrapPanel
              clientId=""
              controlViewState={this.state.controlViewState}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  _defaultColorMap: string;
  updateSharedState: (
    key: keyof IControlViewSharedState,
    value: ValueOf<IControlViewSharedState>
  ) => void;
}
