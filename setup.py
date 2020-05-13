#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from __future__ import print_function
from glob import glob
from os.path import join as pjoin


from setupbase import (
    create_cmdclass, install_npm, ensure_targets,
    find_packages, combine_commands, ensure_python,
    get_version, HERE
)

from setuptools import setup


# The name of the project
name = 'jupyterview'

# Ensure a valid python version
ensure_python('>=3.4')

# Get our version
version = get_version(pjoin(name, '_version.py'))

nb_path = pjoin(HERE, name, 'nbextension', 'static')
lab_path = pjoin(HERE, name, 'labextension')

# Representative files that should exist after a successful build
jstargets = [
    pjoin(nb_path, 'index.js'),
    pjoin(HERE, 'lib', 'plugin.js'),
]

package_data_spec = {
    name: [
        'nbextension/static/*.*js*',
        'labextension/*.tgz'
    ]
}

data_files_spec = [
    ('share/jupyter/nbextensions/jupyterview',
        nb_path, '*.js*'),
    ('share/jupyter/lab/extensions', lab_path, '*.tgz'),
    ('etc/jupyter/nbconfig/notebook.d' , HERE, 'jupyterview.json')
]


cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec,
    data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(
    install_npm(HERE, build_cmd='build:release')
)


setup_args = dict(
    name            = name,
    description     = 'VTK visualisation for jupyter lab',
    version         = version,
    scripts         = glob(pjoin('scripts', '*')),
    cmdclass        = cmdclass,
    packages        = find_packages(),
    author          = 'Trung Le',
    author_email    = 'leductrungxf@gmail.com',
    url             = 'https://github.com//jupyterview',
    license         = 'BSD',
    platforms       = "Linux, Mac OS X, Windows",
    keywords        = ['Jupyter', 'Widgets', 'IPython'],
    classifiers     = [
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Framework :: Jupyter',
    ],
    data_files = [
        ('share/jupyter/nbextensions/jupyterview/itk/WebWorkers', [
            pjoin(nb_path, 'itk', 'WebWorkers', 'Pipeline.worker.js'),
            pjoin(nb_path, 'itk', 'WebWorkers', 'MeshIO.worker.js'),
            pjoin(nb_path, 'itk','WebWorkers','ImageIO.worker.js' ), 
        ]),
        ('share/jupyter/nbextensions/jupyterview/itk/PolyDataIOs', [
            # pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKExodusFileReader.js'),
            # pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKExodusFileReaderWasm.js'),
            # pjoin(nb_path, 'itk','PolyDataIOs','VTKExodusFileReaderWasm.wasm' ), 
            # pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKLegacyFileReader.js'),
            # pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKLegacyFileReaderWasm.js'),
            # pjoin(nb_path, 'itk','PolyDataIOs','VTKLegacyFileReaderWasm.wasm' ), 
            pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKXMLFileReader.js'),
            pjoin(nb_path, 'itk', 'PolyDataIOs', 'VTKXMLFileReaderWasm.js'),
            pjoin(nb_path, 'itk','PolyDataIOs','VTKXMLFileReaderWasm.wasm' ), 
        ]),
    ],

    include_package_data = True,
    install_requires = [
        'ipywidgets>=7.0.0',
    ],
    extras_require = {
        'test': [
            'pytest>=3.6',
            'pytest-cov',
            'nbval',
        ],
        'examples': [
            # Any requirements for the examples to run
        ],
        'docs': [
            'sphinx>=1.5',
            'recommonmark',
            'sphinx_rtd_theme',
            'nbsphinx>=0.2.13,<0.4.0',
            'jupyter_sphinx',
            'nbsphinx-link',
            'pytest_check_links',
            'pypandoc',
        ],
    },
    entry_points = {
    },
)

if __name__ == '__main__':
    setup(**setup_args)
