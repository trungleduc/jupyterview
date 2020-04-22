import React from "react";
import ReactDOM from "react-dom";
import Moment from "moment";
import FileBrowser, { Icons } from "react-keyed-file-browser";

import { SendMsgInterface, VtkModel } from "../widget";
interface PropsInterface {
  send_msg: SendMsgInterface;
  model: VtkModel;
}

interface StateInterface {
  files: Array<{ [key: string]: any }>;
}

export default class RemoteFileBrowser extends React.Component<
  PropsInterface,
  StateInterface
> {
  constructor(props: PropsInterface) {
    super(props);
    const data = this.props.model.get("root_data");
    this.state = {
      files: data,
    };
  }

  render() {
    return (
      <FileBrowser files={this.state.files} icons={Icons.FontAwesome(4)} />
    );
  }
}
