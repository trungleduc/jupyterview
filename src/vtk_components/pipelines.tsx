// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import React from "react";
import { SendMsgInterface, VtkModel } from "../widget";

import {
  Classes,
  Icon,
  Intent,
  ITreeNode,
  Position,
  Tooltip,
  Tree,
} from "@blueprintjs/core";

import * as ReduxAction from "../redux/actions";
import { ReduxStateInterface, Dict } from "../redux/types";
import { connect } from "react-redux";

interface PropsInterface {
  send_msg: SendMsgInterface;
  model: VtkModel;
  pipelines: Array<Dict>
}

interface StateInterface {
  pipelines: Array<Dict>
  nodes: Array<ITreeNode>;
}

const getPipelines = (state: ReduxStateInterface) => {

  return {
    pipelines: state.pipelines
  }
}

const mapStateToProps = (state: ReduxStateInterface) => {
  return getPipelines(state);
};

const mapDispatchToProps = (dispatch: (f: any) => void) => {
  return {
  };
};

const INITIAL_STATE: ITreeNode[] = [
  {
    id: 0,
    hasCaret: true,
    icon: "folder-close",
    label: "Folder 0",
  },
  {
    id: 1,
    icon: "folder-close",
    isExpanded: true,
    label: (
      <Tooltip content="I'm a folder <3" position={Position.RIGHT}>
        Folder 1
      </Tooltip>
    ),
    childNodes: [
      {
        id: 2,
        icon: "document",
        label: "Item 0",
        secondaryLabel: (
          <Tooltip content="An eye!">
            <Icon icon="eye-open" />
          </Tooltip>
        ),
      },
      {
        id: 3,
        icon: (
          <Icon
            icon="tag"
            intent={Intent.PRIMARY}
            className={Classes.TREE_NODE_ICON}
          />
        ),
        label:
          "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.",
      },
      {
        id: 4,
        hasCaret: true,
        icon: "folder-close",
        label: (
          <Tooltip content="foo" position={Position.RIGHT}>
            Folder 2
          </Tooltip>
        ),
        childNodes: [
          { id: 5, label: "No-Icon Item" },
          { id: 6, icon: "tag", label: "Item 1" },
          {
            id: 7,
            hasCaret: true,
            icon: "folder-close",
            label: "Folder 3",
            childNodes: [
              { id: 8, icon: "document", label: "Item 0" },
              { id: 9, icon: "tag", label: "Item 1" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    hasCaret: true,
    icon: "folder-close",
    label: "Super secret files",
    disabled: true,
  },
];


class ShowButton extends React.Component<{pipeline : string, name : string}, { status : boolean}>{
  constructor(props) {
    super(props)
    this.state = {status : false}
  }

  private handleClick = (e) => {
    this.setState((oldState) => ({ ...oldState, status: !oldState.status }))
  }
  render() {
    return (
      <Icon icon={this.state.status ? "eye-open" : "eye-off"} onClick={this.handleClick}
      />
    )
  }
}


export class Pipelines extends React.Component<
  PropsInterface,
  StateInterface
> {
  constructor(props: PropsInterface) {
    super(props);
    this.state = { nodes: [] , pipelines : props.pipelines};
  }

  componentDidUpdate(prevProps: PropsInterface, prevState: StateInterface ) {
    
    if (this.props.pipelines !== prevProps.pipelines) {
      let newPipeLines: Array<ITreeNode> = []
      this.props.pipelines.forEach((item, index) => {
        let childNodes : Array<ITreeNode> = []
        const {name, children} = item
  
        children.forEach((citem, cindex) => {
          childNodes.push({
            id: index + "." + cindex,
            label: citem,
            icon: "document",
            secondaryLabel: <ShowButton pipeline = "local" name = {citem} />
                
          })
        })
        newPipeLines.push({
          id: index,
          hasCaret: true,
          icon: "folder-close",
          label: name,
          isExpanded : true,
          childNodes
          
        })
      })
      this.setState( oldState => ({...oldState, nodes : newPipeLines}) ) 
    }
  }

  // static getDerivedStateFromProps(nextProps: PropsInterface, prevState: StateInterface): StateInterface {
  //   if (nextProps.pipelines !== prevState.pipelines) {

      
  //   } else {
  //     return null
  //   }
  // }

  private handleNodeClick = (
    nodeData: ITreeNode,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    const originallySelected = nodeData.isSelected;
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, (n) => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    this.setState(this.state);
  };

  private handleNodeCollapse = (nodeData: ITreeNode) => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  private handleNodeExpand = (nodeData: ITreeNode) => {
    nodeData.isExpanded = true;
    this.setState(this.state);
  };

  private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      this.forEachNode(node.childNodes, callback);
    }
  }

  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <Tree
          contents={this.state.nodes}
          onNodeClick={this.handleNodeClick}
          onNodeCollapse={this.handleNodeCollapse}
          onNodeExpand={this.handleNodeExpand}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pipelines)