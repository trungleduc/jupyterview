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
      <div className={"bp3-dark"}>
        <Navbar>
          <NavbarGroup align={alignRight ? Alignment.RIGHT : Alignment.LEFT}>
            <NavbarHeading>Jupyter vtk</NavbarHeading>
            <NavbarDivider />
            <Button className={Classes.MINIMAL} icon="home" text="Home" />
            <Button className={Classes.MINIMAL} icon="document" text="Files" />
          </NavbarGroup>
        </Navbar>
      </div>
    );
  }
}
