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
}

interface ITabsProps {}

export default class LeftPanel extends React.Component<ITabsProps, ITabsState> {
  constructor(props: ITabsProps) {
    super(props);
    this.state = {
      activePanelOnly: false,
      animate: true,
      navbarTabId: "Home",
      vertical: false,
    };
  }

  render() {
    return (
      <Tabs
        animate={this.state.animate}
        id="TabsExample"
        key={this.state.vertical ? "vertical" : "horizontal"}
        renderActiveTabPanelOnly={this.state.activePanelOnly}
        vertical={this.state.vertical}
        large={true}
        className={"left-panel"}
        defaultSelectedTabId={"rx"}
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
