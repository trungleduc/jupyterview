from ipywidgets import DOMWidget
from traitlets.traitlets import (
    Unicode,
)
from ._frontend import module_name, module_version


class ViewWidget(DOMWidget):

    _model_name = Unicode("ViewWidgetModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("ViewWidgetView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    file_content = Unicode("").tag(sync=True)

    def __init__(self, path: str, **kwargs):
        super().__init__(**kwargs)
        self.path = path
        with open(path, 'r') as f:
          self.file_content = f.read()
