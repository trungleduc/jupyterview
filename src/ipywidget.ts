import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers
} from '@jupyter-widgets/base';
import { MODULE_NAME, MODULE_VERSION } from './version';

export class ViewWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ViewWidgetModel.model_name,
      _model_module: ViewWidgetModel.model_module,
      _model_module_version: ViewWidgetModel.model_module_version,
      _view_name: ViewWidgetModel.view_name,
      _view_module: ViewWidgetModel.view_module,
      _view_module_version: ViewWidgetModel.view_module_version,
      file_content: ''
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers
    // Add any extra serializers here
  };

  static model_name = 'ViewWidgetModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ViewWidgetView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ViewWidgetView extends DOMWidgetView {
  render() {
    this.el.classList.add('custom-widget');

    this.el.textContent = this.model.get('file_content');
  }
}
