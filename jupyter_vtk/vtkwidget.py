#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Trung Le.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget
from traitlets import Unicode, observe
from traitlets import List as TList
from traitlets import Dict as TDict
from ._frontend import module_name, module_version
from typing import Dict, List
import os
import time

import pathlib
from .tools.tools import pvd_parser

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
  root_data = TList([]).tag(sync=True)
  position = Unicode('split-right').tag(sync=True)
  request_file_list = TList([]).tag(sync=True)
  
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.position = kwargs.get("position", 'split-right')
    self.root_data = []
    self.request_file_list = []
    self.on_msg(self.__handle_client_msg)
    self.handle_dict = {"open_file": self.handle_open_file, "request_open": self.handle_request_open}

  @observe("rootPath")
  def __get_file_structure(self, data) -> Dict:
    new_data = []
    for root, dirs, files in os.walk(self.rootPath):
      dirs[:] = [d for d in dirs if (not d.startswith(
          '.') and not "node_modules" in d and not "__pycache__" in d)]
      # files = [ file for file in files if file.endswith( ('.vtu','.pvd') ) ]
      for file_name in files:
        rel_dir = os.path.relpath(root, self.rootPath)
        if file_name.endswith( ('.vtu','.pvd')):
          rel_file = os.path.join(rel_dir, file_name)
          p = pathlib.PurePath(rel_file)
          abs_dir = os.path.join(root, file_name)
          file_size = os.path.getsize(abs_dir)
          file_time = os.path.getmtime(abs_dir)*1000
          new_data.append({"key": p.as_posix(), "size": file_size, "modified": file_time})
        else:
          p = pathlib.PurePath(rel_dir)
          if (p.as_posix() != "."):
            new_data.append({"key": p.as_posix() + "/"})
    self.root_data = new_data

  def __handle_client_msg(self, widget, content, buffer):
    action = content["action"]
    self.handle_dict[action](content["payload"])

  def handle_request_open(self, payload : List[str])-> None:
    mode = payload["selectedMode"]
    data_path = payload["data"]
    update_data= []
    if mode == 1:
      for file_path in data_path:
        full_path = os.path.join(self.rootPath, file_path)
        if file_path[-3:] == "vtu":
          file_name = file_path.split("/")[-1]
          update_data.append({'file_name': file_name, "full_path": full_path, "pvd": "None", "timestep": "None"})
        if file_path[-3:] == "pvd":
          file_list  = pvd_parser(full_path )
          update_data = update_data + file_list
          
    self.request_file_list = update_data

  def handle_open_file(self, payload):


    index = payload["index"]
    full_path = self.request_file_list[index]["full_path"]
    file_name = self.request_file_list[index]["file_name"]
    pvd = self.request_file_list[index]["pvd"]
    progress = 100.* float(index+1)/len(self.request_file_list)
    if index < len(self.request_file_list) -1:
      next_index = index + 1
    else:
      next_index = -1
      self.request_file_list = []
    with open(full_path, 'rb') as f:
      data = f.read()
      self.send({"type": "vtkData","response": {"pvd": pvd, "file_name": file_name, "progress": progress , "next_index": next_index}}, buffers=[data])


    
