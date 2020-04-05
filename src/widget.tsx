// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

import { BoxModel, VBoxView } from "@jupyter-widgets/controls";
import { MODULE_NAME, MODULE_VERSION } from "./version";

// Import the CSS
import "../css/widget.css";
import { ILabShell } from "@jupyterlab/application";
import { INotebookTracker } from "@jupyterlab/notebook";
import { Kernel } from "@jupyterlab/services";
import { UUID } from "@phosphor/coreutils";

import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";

import VtkWidget from "./vtk_components/vtkwidget"


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
      value: "Hello World",
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

  render() {
    super.render();
    if (VtkView.shell) {
      const w = this.pWidget;

      const content = ReactWidget.create(
        <VtkWidget/>
      );
      w.addWidget(content);
      w.addClass("vtk");

      w.title.label = "Jupyter Vtk";
      w.title.closable = true;

      VtkView.shell["_rightHandler"].sideBar.tabCloseRequested.connect(
        (sender: any, tab: any) => {
          tab.title.owner.dispose();
        }
      );
      w.id = UUID.uuid4();
      let anchor = this.model.get("anchor");
      if (anchor === "right") {
        VtkView.shell.add(w, "right");
        VtkView.shell.expandRight();
      } else {
        VtkView.shell.add(w, "main", { mode: "split-right" });
      }
    }
  }
}
