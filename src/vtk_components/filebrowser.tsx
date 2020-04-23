import React from "react";
import ReactDOM from "react-dom";
import Moment from "moment";
import FileBrowser, { Icons } from "react-keyed-file-browser";
import "react-keyed-file-browser/dist/react-keyed-file-browser.css";
import { SendMsgInterface, VtkModel } from "../widget";
interface PropsInterface {
  send_msg: SendMsgInterface;
  model: VtkModel;
  browserRef :  React.RefObject<any>;
}

interface StateInterface {
  files: Array<{ [key: string]: any }>;
}

export default class RemoteFileBrowser extends React.Component<
  PropsInterface,
  StateInterface
  > {
  selectedFile: Array<string>

  constructor(props: PropsInterface) {
    super(props);
    const data = this.props.model.get("root_data");
    this.state = {
      files: data,
    };
    this.selectedFile = []
  }
  
  emptyRenderer =() => { return (<div></div>) }
  
  render() {
    return (
      <div className = {"file-browser"} style={{ maxHeight: "50vh", width: "100%", overflow: "auto" }}>
        <FileBrowser
          ref = {this.props.browserRef}
          files={this.state.files}
          icons={Icons.FontAwesome(4)}
          detailRenderer = {this.emptyRenderer}
        />
      </div>
    );
  }
}
