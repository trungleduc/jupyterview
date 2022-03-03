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
  const fileTypeList = ['vtp', 'vtu', 'vtk'];
  const widgetFactory = new JupyterViewWidgetFactory({
    name: FACTORY,
    modelName: 'jupyterview-model',
    fileTypes: ['pvd', ...fileTypeList],
    defaultFor: ['pvd', ...fileTypeList]
  });

  // Add the widget to the tracker when it's created
  widgetFactory.widgetCreated.connect((sender, widget) => {
    // Notify the instance tracker if restore data needs to update.
    (window as any).jupyterlabTheme = themeManager.theme;
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
  fileTypeList.forEach((fileType: string) => {
    const FILETYPE = fileType.toUpperCase();
    app.docRegistry.addFileType({
      name: fileType,
      displayName: FILETYPE,
      mimeTypes: ['binary'],
      extensions: [`.${fileType}`, `.${FILETYPE}`],
      fileFormat: 'base64',
      contentType: 'file'
    });
  });
  app.docRegistry.addFileType({
    name: 'pvd',
    displayName: 'PVD',
    mimeTypes: ['text'],
    extensions: ['.pvd', '.PVD'],
    fileFormat: 'text',
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
