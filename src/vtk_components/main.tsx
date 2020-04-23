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
  AnchorButton,
  Code,
  Dialog,
  Intent,
  Tooltip,
} from "@blueprintjs/core";

import VtkWidget from "./vtkwidget";
import LeftPanel from "./panel";
import RemoteFileBrowser from "./filebrowser";
import { Resizable } from "re-resizable";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
};

import { SendMsgInterface, VtkModel } from "../widget";

interface PropsInterface {
  send_msg: SendMsgInterface;
  model: VtkModel;
}

interface StateInterface {
  isOpen: boolean;
}

export default class Main extends React.Component<
  PropsInterface,
  StateInterface
> {
  inputOpenFileRef: React.RefObject<any>;
  browserRef: React.RefObject<any>;
  constructor(props: PropsInterface) {
    super(props);
    this.inputOpenFileRef = React.createRef();
    this.browserRef = React.createRef();

    this.state = { isOpen: false };
  }

  private handleOpen = () =>
    this.setState((oldState) => {
      return { ...oldState, isOpen: true };
    });

  private handleClose = () =>
    this.setState((oldState) => ({ ...oldState, isOpen: false }));

  private handleOpenRemoteFile = () => {
    console.log(this.browserRef.current.child.state.selection);
    this.setState((oldState) => ({ ...oldState, isOpen: false }));
  };

  render() {
    const alignRight = true;
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Navbar className={"bp3-dark"}>
          <NavbarGroup align={alignRight ? Alignment.RIGHT : Alignment.LEFT}>
            <NavbarHeading>JupyterView</NavbarHeading>
            <NavbarDivider />

            <Button
              onClick={() => {
                this.inputOpenFileRef.current.click();
              }}
              className={Classes.MINIMAL}
              icon="document"
              text="Local"
            />
            <Button
              onClick={this.handleOpen}
              className={Classes.MINIMAL}
              icon="cloud"
              text="Remote"
            />
            <Button className={Classes.MINIMAL} icon="cog" text="Setting" />
          </NavbarGroup>
        </Navbar>
        <div
          style={{
            width: "100%",
            display: "flex",
            overflow: "hidden",
            flexGrow: 1,
          }}
        >
          <Resizable
            style={style}
            defaultSize={{
              width: "25%",
              height: "100%",
            }}
            maxWidth={"70%"}
            minWidth={220}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            onResize={() => {
              window.dispatchEvent(new Event("resize"));
            }}
          >
            <LeftPanel />
          </Resizable>
          <div style={{ ...style, width: "100%", minWidth: "1px" }}>
            <VtkWidget inputOpenFileRef={this.inputOpenFileRef} />
          </div>
        </div>
        <Dialog
          icon="info-sign"
          onClose={this.handleClose}
          title="Open remote files"
          isOpen={this.state.isOpen}
          style={{ width: "50vw" }}
        >
          <div className={Classes.DIALOG_BODY}>
            <RemoteFileBrowser
              send_msg={this.props.send_msg}
              model={this.props.model}
              browserRef={this.browserRef}
            />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={this.handleClose}>Close</Button>
              <AnchorButton
                intent={Intent.PRIMARY}
                onClick={this.handleOpenRemoteFile}
              >
                Open
              </AnchorButton>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}
