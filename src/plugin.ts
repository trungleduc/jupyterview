// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.


import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import { 
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from "@jupyterlab/application";
import { INotebookTracker } from "@jupyterlab/notebook";


import * as widgetExports from "./widget";

import { MODULE_NAME, MODULE_VERSION } from "./version";


const EXTENSION_ID = "jupyter_vtk:plugin";

/**
 * The example plugin.
 */
const examplePlugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  requires: [IJupyterWidgetRegistry, ILabShell],
  optional: [INotebookTracker],
  activate: activateWidgetExtension,
  autoStart: true,
};

export default examplePlugin;

/**
 * Activate the widget extension.
 */
function activateWidgetExtension(
  app: JupyterFrontEnd,
  registry: IJupyterWidgetRegistry,
  shell: ILabShell,
  tracker: INotebookTracker
): void {

  widgetExports.VtkView.shell = shell;
  widgetExports.VtkView.tracker = tracker;

  registry.registerWidget({
    name: MODULE_NAME,
    version: MODULE_VERSION,
    exports: widgetExports as any,
  });
}
