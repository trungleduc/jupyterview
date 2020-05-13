
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
# JupyterView

[![Build Status](https://travis-ci.org/trungleduc/jupyterview.svg?branch=master)](https://travis-ci.org/trungleduc/jupyterview)
[![codecov](https://codecov.io/gh/trungleduc/jupyterview/branch/master/graph/badge.svg)](https://codecov.io/gh/trungleduc/jupyterview)


A data visualization widget for JupyterLab.


[![jupyterview.gif](https://s4.gifyu.com/images/jupyterview.gif)](https://gifyu.com/image/n9Vb)

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/trungleduc"><img src="https://avatars3.githubusercontent.com/u/4451292?v=4" width="100px;" alt=""/><br /><sub><b>Duc Trung LE</b></sub></a><br /><a href="#infra-trungleduc" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/trungleduc/jupyterview/commits?author=trungleduc" title="Tests">⚠️</a> <a href="https://github.com/trungleduc/jupyterview/commits?author=trungleduc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tridatngo"><img src="https://avatars1.githubusercontent.com/u/21169541?v=4" width="100px;" alt=""/><br /><sub><b>tridatngo</b></sub></a><br /><a href="#infra-tridatngo" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/trungleduc/jupyterview/commits?author=tridatngo" title="Tests">⚠️</a> <a href="https://github.com/trungleduc/jupyterview/commits?author=tridatngo" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
