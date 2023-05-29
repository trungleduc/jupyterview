import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { Contents } from '@jupyterlab/services';

import { ParserManager } from '../reader/manager';
import { JupyterViewDoc, JupyterViewModel } from './model';
import { JupyterViewPanel, JupyterViewWidget } from './widget';

export class JupyterViewWidgetFactory extends ABCWidgetFactory<
  JupyterViewWidget,
  JupyterViewModel
> {
  constructor(
    options: DocumentRegistry.IWidgetFactoryOptions,
    private parsers: ParserManager
  ) {
    super(options);
  }

  /**
   * Create a new widget given a context.
   *
   * @param context Contains the information of the file
   * @returns The widget
   */
  protected createNewWidget(
    context: DocumentRegistry.IContext<JupyterViewModel>
  ): JupyterViewWidget {
    return new JupyterViewWidget({
      context,
      content: new JupyterViewPanel(context, this.parsers)
    });
  }
}

/**
 * A Model factory to create new instances of JupyterViewModel.
 */
export class JupyterViewModelFactory
  implements DocumentRegistry.IModelFactory<JupyterViewModel>
{
  /**
   * The name of the model.
   *
   * @returns The name
   */
  get name(): string {
    return 'jupyterview-model';
  }

  /**
   * The content type of the file.
   *
   * @returns The content type
   */
  get contentType(): Contents.ContentType {
    return 'file';
  }

  /**
   * The format of the file.
   *
   * @returns the file format
   */
  get fileFormat(): Contents.FileFormat {
    return 'base64';
  }

  /**
   * Get whether the model factory has been disposed.
   *
   * @returns disposed status
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * Dispose the model factory.
   */
  dispose(): void {
    this._disposed = true;
  }

  /**
   * Get the preferred language given the path on the file.
   *
   * @param path path of the file represented by this document model
   * @returns The preferred language
   */
  preferredLanguage(path: string): string {
    return '';
  }

  /**
   * Create a new instance of JupyterViewModel.
   */
  createNew(options: { sharedModel: JupyterViewDoc }): JupyterViewModel {
    const model = new JupyterViewModel(options);
    return model;
  }

  private _disposed = false;
}
