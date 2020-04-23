// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import { BoxModel, VBoxView } from "@jupyter-widgets/controls";
import { MODULE_NAME, MODULE_VERSION } from "./version";

// Import the CSS
import "../css/widget.css";
import { ILabShell } from "@jupyterlab/application";
import { INotebookTracker } from "@jupyterlab/notebook";
import { Kernel } from "@jupyterlab/services";
import { UUID } from "@lumino/coreutils";
import { PageConfig } from "./tools/getOption";
import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";
import Main from "./vtk_components/main";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { rootReducer } from "./redux/reducers";
import { StateInterface } from "./redux/types";
import { initialState } from "./redux/reducers";

const getEnhancers = () => {
  let enhancers = applyMiddleware(thunk);
  if (
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    process.env.NODE_ENV === "development"
  ) {
    enhancers = compose(
      enhancers,
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
  return enhancers;
};

export type SendMsgInterface = (
  content: {},
  buffers?: ArrayBuffer[] | ArrayBufferView[] | undefined
) => void;

export class VtkModel extends BoxModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: VtkModel.model_name,
      _model_module: VtkModel.model_module,
      _model_module_version: VtkModel.model_module_version,
      _view_name: VtkModel.view_name,
      _view_module: VtkModel.view_module,
      _view_module_version: VtkModel.view_module_version,
      rootPath: "",
      position: "split-right",
      root_data: [],
    };
  }

  initialize(
    attributes: any,
    options: {
      model_id: string;
      comm?: any;
      widget_manager: any;
    }
  ) {
    super.initialize(attributes, options);
    this.widget_manager.display_model(undefined as any, this, {});
  }

  static model_name = "VtkModel";
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = "VtkView"; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

class WrapperWidget extends ReactWidget {
  lastUpdate: number;
  store: any;
  send_msg: SendMsgInterface;
  model: VtkModel;
  constructor(
    initialState: StateInterface,
    send_msg: SendMsgInterface,
    model: VtkModel
  ) {
    super();
    this.lastUpdate = Date.now();
    this.store = createStore(
      rootReducer,
      initialState,
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
    this.send_msg = send_msg;
    this.model = model;
  }

  onResize = (msg: any) => {
    window.dispatchEvent(new Event("resize"));
  };

  render() {
    return (
      <Provider store={this.store}>
        <Main send_msg={this.send_msg} model={this.model} />
      </Provider>
    );
  }
}

export class VtkView extends VBoxView {
  static tracker: INotebookTracker;
  static shell: ILabShell;

  // initialize(parameters: any): void {
  //   super.initialize(parameters);
  //   const nb = VtkView.tracker.currentWidget;
  //   if (nb) {
  //     const session = nb.sessionContext.session;
  //     if (session) {
  //       session.statusChanged.connect(this._handleKernelStatusChanged, this);
  //     }
  //   }
  // }

  /**
   * Public constructor
   */

  /**
   * Handle dispose of the parent
   */
  protected _handleKernelStatusChanged(
    sender: any,
    status: Kernel.Status
  ): void {
    if (status === "restarting" || status === "dead") {
      sender.statusChanged.disconnect(this._handleKernelStatusChanged, this);
      this.remove();
    }
  }

  getStore(): StateInterface {
    let store = { ...initialState };
    let newStore: StateInterface = {
      ...store,
    };

    let savedStore = this.model.get("initial_store");
    for (const key in savedStore) {
      if (savedStore.hasOwnProperty(key) && newStore.hasOwnProperty(key)) {
        newStore[key as keyof StateInterface] = savedStore[key];
      }
    }
    return newStore;
  }

  render() {
    super.render();
    if (VtkView.shell) {
      const rootPath = PageConfig.getOption("serverRoot");
      this.model.set("rootPath", rootPath);
      this.model.save_changes();
      const w = this.pWidget;

      const content = new WrapperWidget(
        this.getStore(),
        this.send.bind(this),
        this.model
      );

      w.addWidget(content);
      w.addClass("vtk");

      w.title.label = "JupyterView";
      w.title.closable = true;

      VtkView.shell["_rightHandler"].sideBar.tabCloseRequested.connect(
        (sender: any, tab: any) => {
          tab.title.owner.dispose();
        }
      );
      w.id = UUID.uuid4();
      let anchor = this.model.get("position");
      if (anchor === "right") {
        VtkView.shell.add(w, "right");
        VtkView.shell.expandRight();
      } else {
        VtkView.shell.add(w, "main", { mode: anchor });
      }
    }
  }
}
