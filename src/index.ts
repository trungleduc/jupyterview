import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabShell
} from '@jupyterlab/application';
import { IThemeManager } from '@jupyterlab/apputils';

import {
  JupyterViewWidgetFactory,
  JupyterViewModelFactory
} from './mainview/factory';
import { JupyterViewWidget } from './mainview/widget';
import { PanelWidget } from './panelview/widget';
import { IJupyterViewDocTracker, IVtkTracker } from './token';
import { jvcLightIcon } from './tools';
import { VtkTracker } from './vtkTracker';

const FACTORY = 'Jupyterview Factory';
const NAME_SPACE = 'jupyterview';
const activate = (
  app: JupyterFrontEnd,
  restorer: ILayoutRestorer,
  themeManager: IThemeManager,
  shell: ILabShell
): IVtkTracker => {
  const tracker = new VtkTracker({ namespace: NAME_SPACE });

  if (restorer) {
    restorer.restore(tracker, {
      command: 'docmanager:open',
      args: widget => ({ path: widget.context.path, factory: FACTORY }),
      name: widget => widget.context.path
    });
  }

  // Creating the widget factory to register it so the document manager knows about
  // our new DocumentWidget
  const widgetFactory = new JupyterViewWidgetFactory({
    name: FACTORY,
    modelName: 'jupyterview-model',
    fileTypes: ['vtp', 'vtu'],
    defaultFor: ['vtp', 'vtu']
  });

  // Add the widget to the tracker when it's created
  widgetFactory.widgetCreated.connect((sender, widget) => {
    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => {
      tracker.save(widget);
    });
    themeManager.themeChanged.connect((_, changes) =>
      widget.context.model.themeChanged.emit(changes)
    );
    tracker.add(widget);
  });
  app.docRegistry.addWidgetFactory(widgetFactory);

  // Creating and registering the model factory for our custom DocumentModel
  const modelFactory = new JupyterViewModelFactory();
  app.docRegistry.addModelFactory(modelFactory);
  // register the filetype
  app.docRegistry.addFileType({
    name: 'vtp',
    displayName: 'VTP',
    mimeTypes: ['binary'],
    extensions: ['.vtp', '.VTP'],
    fileFormat: 'base64',
    contentType: 'file'
  });
  app.docRegistry.addFileType({
    name: 'vtu',
    displayName: 'VTU',
    mimeTypes: ['binary'],
    extensions: ['.vtu', '.VTU'],
    fileFormat: 'base64',
    contentType: 'file'
  });
  console.log('JupyterLab extension jupyterview is activated!');
  shell.currentChanged.connect((shell, change) => {
    const widget = change.newValue;
    if (widget instanceof JupyterViewWidget) {
      window.dispatchEvent(new Event('resize'));
    }
  });
  return tracker;
};
/**
 * Initialization data for the jupyterview extension.
 */
const plugin: JupyterFrontEndPlugin<IVtkTracker> = {
  id: 'jupyterview:plugin',
  autoStart: true,
  requires: [ILayoutRestorer, IThemeManager, ILabShell],
  provides: IJupyterViewDocTracker,
  activate
};

const controlPanel: JupyterFrontEndPlugin<void> = {
  id: 'jupyterview:controlpanel',
  autoStart: true,
  requires: [ILayoutRestorer, ILabShell, IJupyterViewDocTracker],
  activate: (
    app: JupyterFrontEnd,
    restorer: ILayoutRestorer,
    shell: ILabShell,
    tracker: IVtkTracker
  ) => {
    const controlPanel = new PanelWidget(tracker);
    controlPanel.id = 'jupyterview::controlPanel';
    controlPanel.title.caption = 'JupyterView Control Panel';
    controlPanel.title.icon = jvcLightIcon;
    if (restorer) {
      restorer.add(controlPanel, NAME_SPACE);
    }

    app.shell.add(controlPanel, 'right', { rank: 100 });
  }
};
export default [plugin, controlPanel];
