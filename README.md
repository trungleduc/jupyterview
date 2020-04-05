
# jupyter_vtk

[![Build Status](https://travis-ci.org//jupyter_vtk.svg?branch=master)](https://travis-ci.org//jupyter_vtk)
[![codecov](https://codecov.io/gh//jupyter_vtk/branch/master/graph/badge.svg)](https://codecov.io/gh//jupyter_vtk)


VTK visualisation for jupyter lab

## Installation

You can install using `pip`:

```bash
pip install jupyter_vtk
```

Or if you use jupyterlab:

```bash
pip install jupyter_vtk
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] jupyter_vtk
```
