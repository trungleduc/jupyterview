<h1 align="center">jupyterview</h1>

[![Github Actions Status](https://github.com/trungleduc/jupyterview/workflows/Build/badge.svg)](https://github.com/trungleduc/jupyterview/actions/workflows/build.yml) [![Lite](https://jupyterlite.rtfd.io/en/latest/_static/badge.svg)](https://trungleduc.github.io/jupyterview) [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/trungleduc/jupyterview/master?urlpath=lab) [![GitHub license](https://badgen.net/github/license/trungleduc/jupyterview)](https://github.com/trungleduc/jupyterview/blob/master/LICENSE) [![PyPI version](https://badge.fury.io/py/jupyterview.svg)](https://badge.fury.io/py/jupyterview) [![Conda Version](https://img.shields.io/conda/vn/conda-forge/jupyterview.svg)](https://anaconda.org/conda-forge/jupyterview)

<h2 align="center"> VTK Data visualization extension for JupyterLab</h2>


**jupyterview** is an extension that adds the `VTK` data visualization capability to JupyterLab.

Powered by Kitware's `vtk.js` and `itk-wasm` library, **jupyterview** is a pure frontend extension, it does not require any kernel to operate and fully supports the Real-Time Collaboration feature of JupyterLab.

**jupyterview** is fully compatible with `jupyterlite`, it is available online at [jupyterview demo link](https://trungleduc.github.io/jupyterview).

## Features

- Visualize structured and unstructured data (`.vtu`, `.vtp`, `.vtk` flies).

![vtu](https://user-images.githubusercontent.com/4451292/157323037-f0d8149c-410b-483b-812a-3a4e3d524552.gif)

- Visualize and animate `.pvd` files.

![pvd](https://user-images.githubusercontent.com/4451292/157324587-0b89159d-f4db-4227-b58b-437c75f69855.gif)

- Visualize mesh supported by `meshio` library.

https://user-images.githubusercontent.com/4451292/173418573-1839d689-763f-42ba-add3-4eaac4c87d7e.mp4

- Real-time collaborative visualization.

![colab](https://user-images.githubusercontent.com/4451292/157325576-c79c9ee8-6428-4e96-afa6-827467e70438.gif)

- Multiple display modes: `Surface`, `Surface with Edge`, `Wireframe` and `Points`
- Color scale and isocolor effet.
- Warp by scalar effet.

## Requirements

* JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyterview
```
or with mamba/conda

```bash
  conda install -c conda-forge  jupyterview
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterview directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyterview
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `jupyterview` within that folder.

### Packaging the extension

See [RELEASE](RELEASE.md)

## Thanks
The following libraries / open-source projects were used or inspired in the development of jupyterview:
 * [vtk.js](https://github.com/Kitware/vtk-js)
 * [itk-wasm](https://github.com/InsightSoftwareConsortium/itk-wasm)
 * [paraview-glance](https://github.com/Kitware/paraview-glance)
