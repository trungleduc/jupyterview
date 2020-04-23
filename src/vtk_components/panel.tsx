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
    <H3>Example panel: React</H3>
    <p className={Classes.RUNNING_TEXT}>
      Lots of people use React as the V in MVC. Since React makes no assumptions
      about the rest of your technology stack, it's easy to try it out on a
      small feature in an existing project.
    </p>
  </div>
);

const ToolsPanel: React.SFC<{}> = () => (
  <div>
    <H3>Example panel: Angular</H3>
    <p className={Classes.RUNNING_TEXT}>
      HTML is great for declaring static documents, but it falters when we try
      to use it for declaring dynamic views in web-applications. AngularJS lets
      you extend HTML vocabulary for your application. The resulting environment
      is extraordinarily expressive, readable, and quick to develop.
    </p>
  </div>
);

const InfoPanel: React.SFC<{}> = () => (
  <div>
    <H3>Example panel: Ember</H3>
    <p className={Classes.RUNNING_TEXT}>
      Ember.js is an open-source JavaScript application framework, based on the
      model-view-controller (MVC) pattern. It allows developers to create
      scalable single-page web applications by incorporating common idioms and
      best practices into the framework. What is your favorite JS framework?
    </p>
  </div>
);
