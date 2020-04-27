import React, { Component, AriaAttributes } from "react";
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
  Card,
  Elevation,
} from "@blueprintjs/core";

import VtkWidget from "./vtkwidget";
import LeftPanel from "./panel";
import RemoteFileBrowser from "./filebrowser";
import ProgressNotification from "./progress";
import { Resizable } from "re-resizable";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
};

import { SendMsgInterface, VtkModel } from "../widget";
import { throws } from "assert";

interface PropsInterface {
  send_msg: SendMsgInterface;
  model: VtkModel;
}

interface StateInterface {
  isOpen: boolean;
  openProgressBar: boolean;
  progressValue: number;
  leftPanelId: number
}

export default class Main extends React.Component<
  PropsInterface,
  StateInterface
> {
  private inputOpenFileRef: React.RefObject<any>;
  private browserRef: React.RefObject<any>;
  private treewindowRef: React.RefObject<HTMLDivElement>;
  private toolwindowRef: React.RefObject<HTMLDivElement>;
  private panelRef: React.RefObject<HTMLDivElement>;

  constructor(props: PropsInterface) {
    super(props);
    this.inputOpenFileRef = React.createRef();
    this.browserRef = React.createRef();
    this.treewindowRef = React.createRef();
    this.toolwindowRef = React.createRef();
    this.panelRef = React.createRef();
    this.state = { isOpen: false, openProgressBar: false, progressValue: 0, leftPanelId : 0 };
  }

  private updateProgress = (
    openProgressBar: boolean,
    progressValue: number
  ) => {
    this.setState((oldState) => ({
      ...oldState,
      openProgressBar,
      progressValue,
    }));
  };
  private handleOpen = () =>
    this.setState((oldState) => {
      return { ...oldState, isOpen: true };
    });

  private handleClose = () =>
    this.setState((oldState) => ({ ...oldState, isOpen: false }));

  private handleOpenRemoteFile = () => {
    const data: Array<string> = this.browserRef.current.child.state.selection;
    let selectedMode = -1;
    let selectedFile = [];
    let selectedFolder = [];
    let payload;
    for (let item of data) {
      if (item.endsWith("/")) {
        selectedFolder.push(item);
      } else {
        selectedFile.push(item);
      }
    }
    if (selectedFolder.length > 0 && selectedFile.length > 0) {
      //Select both folders and files -> only files are selected
      selectedMode = 1;
      payload = { selectedMode, data: selectedFile };
    } else if (selectedFolder.length > 0 && selectedFile.length === 0) {
      //Select multiple folders and not file -> only first folder is selected
      selectedMode = 0;
      payload = { selectedMode, data: [selectedFolder[0]] };
    } else if (selectedFolder.length === 0 && selectedFile.length > 0) {
      //Select multiple files and not folder -> all files are selected
      selectedMode = 1;
      payload = { selectedMode, data: selectedFile };
    }

    if (selectedMode > -1) {
      this.props.send_msg({
        action: "request_open",
        payload,
      });
      this.updateProgress(true, 0);
    }
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
            onResizeStop={(event, direction, elementRef, delta) => {
              this.setState(old => ({...old, leftPanelId : old.leftPanelId + 1})) 
            }}
          >
            <div
              ref={this.panelRef}
              style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Resizable
                defaultSize={{
                  width: "100%",
                  height: "25%",
                }}
                enable={{
                  top: false,
                  right: false,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }}
                onResizeStop={(event, direction, elementRef, delta) => {
                  const topHeight = elementRef.getBoundingClientRect().height;
                  const totalHeight = this.panelRef.current.getBoundingClientRect()
                    .height;
                  const bottomHeight = totalHeight - topHeight;
                  this.toolwindowRef.current.style.height = bottomHeight + "px";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: "5px 0px 5px 5px",
                  }}
                  ref={this.treewindowRef}
                >
                  <Card
                    style={{
                      height: "100%",
                      padding: "0px",
                      overflow: "auto",
                      background: "aliceblue",
                      border: "solid grey 1px",
                      borderBottom: "solid #106ba3",
                      borderRadius: "5px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    interactive={false}
                    elevation={Elevation.ONE}
                  >
                    <div
                      style={{
                        height: "25px",
                        width: "100%",
                        background: "rgb(16, 107, 163)",
                        color: "aliceblue",
                        padding: "2px",
                      }}
                    >
                      PIPELINES
                    </div>
                    <div style={{ flexGrow: 1 }}></div>
                  </Card>
                </div>
              </Resizable>
              <div
                ref={this.toolwindowRef}
                style={{ height: "75%", padding: "5px 0px 5px 5px" }}
              >
                <Card
                  style={{
                    height: "100%",
                    padding: "0px",
                    overflow: "auto",
                    background: "aliceblue",
                    border: "solid grey 1px",
                    borderRadius: "5px",
                  }}
                  interactive={false}
                  elevation={Elevation.ONE}
                >
                  <LeftPanel selectedId={this.state.leftPanelId}/>
                </Card>
              </div>
            </div>
          </Resizable>
          <div style={{ padding: "5px", height: "100%", width: "100%" }}>
            <Card
              style={{
                height: "100%",
                width: "100%",
                padding: "5px",
                overflow: "auto",
                background: "aliceblue",
                border: "solid grey 1px",
              }}
              interactive={false}
              elevation={Elevation.ONE}
            >
              <VtkWidget
                inputOpenFileRef={this.inputOpenFileRef}
                model={this.props.model}
                send_msg={this.props.send_msg}
                updateProgress={this.updateProgress}
              />
            </Card>
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
        <ProgressNotification
          open={this.state.openProgressBar}
          value={this.state.progressValue}
        />
      </div>
    );
  }
}
