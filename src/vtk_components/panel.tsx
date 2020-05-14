// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import * as React from "react";

import {
  Alignment,
  Classes,
  H3,
  H5,
  InputGroup,
  Navbar,
  Switch,
  Tab,
  TabId,
  Tabs,
} from "@blueprintjs/core";

interface ITabsState {
  activePanelOnly: boolean;
  animate: boolean;
  navbarTabId: TabId;
  vertical: boolean;
  selectedId : string
}

interface ITabsProps {
  selectedId ?: number
}

export default class LeftPanel extends React.Component<ITabsProps, ITabsState> {
  constructor(props: ITabsProps) {
    super(props);
    this.state = {
      activePanelOnly: false,
      animate: true,
      navbarTabId: "Home",
      vertical: false,
      selectedId : "rx"
    };
  }

  componentDidUpdate(oldProps, oldState) {
    const selectedId = this.props.selectedId
    
    if (selectedId !==oldProps.selectedId) {
      this.setState(old => ({...old, selectedId: "rx"}))
    }

  }

  handleChange = (e: string) => {
    this.setState((old)=> ({...old, selectedId : e}));
  }

  render() {
    return (
      <Tabs
        animate={this.state.animate}
        id="TabsExample"
        key={this.state.vertical ? "vertical" : "horizontal"}
        renderActiveTabPanelOnly={this.state.activePanelOnly}
        vertical={this.state.vertical}
        large={false}
        className={"left-panel"}
        selectedTabId= {this.state.selectedId}
        onChange = {this.handleChange}
      >
        <Tab
          className={"left-panel-tab"}
          id="rx"
          title="SOURCE"
          panel={<SourcePanel />}
        />
        <Tab
          className={"left-panel-tab"}
          id="ng"
          title="TOOLS"
          panel={<ToolsPanel />}
        />
        <Tab
          className={"left-panel-tab"}
          id="mb"
          title="INFO"
          panel={<InfoPanel />}
        />
      </Tabs>
    );
  }
}

const SourcePanel: React.SFC<{}> = () => (
  <div>
    <H3>SourcePanel</H3>

  </div>
);

const ToolsPanel: React.SFC<{}> = () => (
  <div>
    <H3>ToolsPanel</H3>

  </div>
);

const InfoPanel: React.SFC<{}> = () => (
  <div>
    <H3>InfoPanel</H3>

  </div>
);
