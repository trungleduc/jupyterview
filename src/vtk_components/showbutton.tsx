// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import React from "react";

import { Icon } from "@blueprintjs/core";

import * as ReduxAction from "../redux/actions";
import { ReduxStateInterface, Dict } from "../redux/types";
import { connect } from "react-redux";

const getPipelines = (state: ReduxStateInterface) => {
  return {
    pipelineList: state.pipelines,
  };
};

const mapStateToProps = (state: ReduxStateInterface) => {
  return getPipelines(state);
};

const mapDispatchToProps = (dispatch: (f: any) => void) => {
  return {
    switchPipeline: (data: Dict ) => dispatch(ReduxAction.switchPipeline(data))
  };
};

interface PropsInterface {
  pipeline: string;
  name: string;
  activated: boolean;
  pipelineList: Array<Dict>;
  switchPipeline: (data: Dict) => (f: any) => void
}

interface StateInterface {
  status: boolean;
}
class ShowButton extends React.Component<PropsInterface, StateInterface> {
  constructor(props) {
    super(props);
    this.state = { status: false };
  }

  componentDidUpdate(prevProps: PropsInterface, prevState: StateInterface) {
    const pipelineName = this.props.pipeline;    
    const selectedPipeline = this.props.pipelineList.filter(value => (value.name === pipelineName))
    const item = selectedPipeline[0]["children"].filter(value => (value["name"] === this.props.name))    
    if (item[0]["activated"] !== this.state.status) {
      this.setState((oldState) => ({ ...oldState, status: item[0]["activated"] })); 
    }
  }
  private handleClick = (e) => {
    const currentStatus = this.state.status
    this.props.switchPipeline({pipeline: this.props.pipeline, name : this.props.name, status : !currentStatus })
  };
  render() {
    return (
      <Icon
        icon={this.state.status ? "eye-open" : "eye-off"}
        onClick={this.handleClick}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowButton);
