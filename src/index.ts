import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
  ILabShell
} from '@jupyterlab/application';
import {
  WidgetTracker,
  IWidgetTracker,
  IThemeManager
} from '@jupyterlab/apputils';

import { Token } from '@lumino/coreutils';
import { JupyterViewWidgetFactory, JupyterViewModelFactory } from './mainview/factory';
import { JupyterViewWidget } from './mainview/widget';

// import { requestAPI } from './handler';

const FACTORY = 'Jupyterview Factory';

export const IJupyterViewDocTracker = new Token<
  IWidgetTracker<JupyterViewWidget>
>('jupyterViewDocTracker');

const activate = (
  app: JupyterFrontEnd,
  restorer: ILayoutRestorer,
  themeManager: IThemeManager,
  shell: ILabShell
): void => {
  const namespace = 'jupyterview';
  const tracker = new WidgetTracker<JupyterViewWidget>({ namespace });

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
};
/**
 * Initialization data for the jupyterview extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterview:plugin',
  autoStart: true,
  requires: [ILayoutRestorer, IThemeManager, ILabShell],
  activate
};

export default plugin;
