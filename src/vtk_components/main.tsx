import React, { Component } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {
  Alignment,
  Button,
  Classes,
  H5,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Switch,
  Colors,
} from "@blueprintjs/core";

import VtkWidget from "./vtkwidget"
import LeftPanel from "./panel"
import { Resizable } from "re-resizable";
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0',
};

interface PropsInterface {}

interface StateInterface {}

export default class Main extends React.Component<
  PropsInterface,
  StateInterface
> {
  constructor(props: PropsInterface) {
    super(props);
  }

  render() {
    const alignRight = true;
    return (
      <div  style={{height: "100%", display:"flex", flexDirection: "column"
      }}>
        <Navbar className={"bp3-dark"} >
          <NavbarGroup align={alignRight ? Alignment.RIGHT : Alignment.LEFT}>
            <NavbarHeading>JupyterView</NavbarHeading>
            <NavbarDivider />
            <Button  className={Classes.MINIMAL} icon="document" text="Files" />
            <Button  className={Classes.MINIMAL} icon="cog" text="Setting" />
          </NavbarGroup>
        </Navbar>
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            flexGrow : 1
          }}
        >
          <Resizable
            style={style}
            defaultSize={{
              width: "25%",
              height: "100%",
            }}
            maxWidth={"70%"}
            minWidth= {220}
            enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            onResize = {() => {
              window.dispatchEvent(new Event('resize'))
            }}
          >
            <LeftPanel/>
          </Resizable>
          <div style={{ ...style, width: "100%", minWidth: "1px" }}>
            <VtkWidget/>
          </div>
        </div>
      </div>
    );
  }
}
