

# JupyterView

[![build](https://github.com/trungleduc/jupyterview/workflows/build/badge.svg)](https://github.com/trungleduc/jupyterview/actions)
[![codecov](https://codecov.io/gh/trungleduc/jupyterview/branch/master/graph/badge.svg)](https://codecov.io/gh/trungleduc/jupyterview)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

A data visualization widget for JupyterLab.


![Screencast](https://i.postimg.cc/Z55jHvMR/jupyterview2.gif)

This project is under active development, the interface and behavior may change at any time.

## Installation

You can install using `pip`:

```bash
pip install jupyterview
```

Install `jupyterlab-manager`, skip it if already installed

```bash
jupyter labextension install @jupyter-widgets/jupyterlab-manager --no-build
```

Rebuild JupyterLab to enable the front-end widget (nodejs required):

```bash
jupyter lab build
```

## Development

### First time set up

```bash
# Create a new conda environment
conda create -n jupyterview -c conda-forge jupyterlab ipywidgets nodejs

# Activate the conda environment
conda activate jupyterview

# Install the jupyterview Python package
python -m pip install -e .

# Install front-end dependencies
jlpm install

# Build Typescript source
jlpm build

# Link your development version of the extension with JupyterLab
jupyter labextension link .

# Rebuild JupyterLab.
jupyter lab build

```

### Auto-rebuild development mode

```bash
# Run jupyterlab in watch mode, this will cause the application to incrementally rebuild when one of the linked packages changes
jupyter lab --watch

# Rebuild Typescript source after making changes
jlpm build

```
