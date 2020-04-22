#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Trung Le.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode, observe
from traitlets import Dict as TDict
from ._frontend import module_name, module_version
from typing import Dict
import os
import pathlib
class VtkWidget(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('VtkModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('VtkView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    rootPath = Unicode('').tag(sync=True)
    position = Unicode('split-right').tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.position = kwargs.get("position", 'split-right' )
        self.root_data = []
    
    @observe("rootPath")
    def __get_file_structure(self, data) -> Dict:
        for root, dirs, files in os.walk(self.rootPath):
            dirs[:] = [d for d in dirs if (not d.startswith('.') and not "node_modules" in d and not "__pycache__" in d) ]
            for file_name  in files:
                rel_dir = os.path.relpath(root, self.rootPath)
                rel_file = os.path.join(rel_dir, file_name)
                p = pathlib.PurePath(rel_file) 
                self.root_data.append({"key": p.as_posix()})
            

    def test(self):
        pass