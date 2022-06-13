
import json
from pathlib import Path

from ._version import __version__
from .widget import ViewWidget

HERE = Path(__file__).parent.resolve()

with (HERE / "labextension" / "package.json").open() as fid:
    data = json.load(fid)

def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": data["name"]
    }]

def _jupyter_nbextension_paths():
    return [
        {
            'section': 'notebook',
            'src': 'nbextension',
            'dest': 'jupyterview',
            'require': 'jupyterview/extension',
        }
    ]