from typing import Dict
import xml.etree.ElementTree as ET
import os

def pvd_parser(path: str) -> Dict:
  tree = ET.parse(path)
  root = tree.getroot()
  file_list = []
  pvd_path, pvd_name = os.path.split(path)
  for dataset in root.iter('DataSet'):
    time_step = dataset.get("timestep")
    file_name = dataset.get("file")
    full_path = os.path.join(pvd_path, file_name )
    file_list.append({'file_name': file_name, "full_path": full_path, "pvd": pvd_name, "timestep": time_step})

  return file_list

