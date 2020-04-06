const path = require('path');
const version = require('./package.json').version;
const CopyPlugin = require('copy-webpack-plugin')

// Custom webpack rules
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;
const rules = [
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/, use: ['style-loader', 'css-loader']}
].concat(vtkRules);

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base', "@jupyterlab/apputils", "react", "@jupyterlab/application", "@jupyterlab/notebook", "@jupyter-widgets/controls", "@jupyterlab/services", "@phosphor/coreutils"];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  alias: {
    './itkConfig$': path.resolve(__dirname, 'lib', 'itkConfigJupyter.js'),
  },
};

module.exports = [
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'jupyter_vtk', 'nbextension', 'static'),
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
  },

  /**
   * Embeddable jupyter_vtk bundle
   *
   * This bundle is almost identical to the notebook extension bundle. The only
   * difference is in the configuration of the webpack public path for the
   * static assets.
   *
   * The target bundle is always `dist/index.js`, which is the path required by
   * the custom widget embedder.
   */
  {
    entry: './lib/plugin.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'amd',
        library: "jupyter_vtk",
        publicPath: 'https://unpkg.com/jupyter_vtk@' + version + '/dist/'
    },
    devtool: 'source-map',
    module: {
        rules: rules
    },
    externals,
    resolve,
    plugins: [
      new CopyPlugin([
        {
        from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
        to: path.join(__dirname, 'dist', 'itk', 'WebWorkers'),
        },
        {
        from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
        to: path.join(__dirname, 'dist', 'itk', 'MeshIOs'),
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk', 'PolyDataIOs'),
          to: path.join(__dirname, 'dist', 'itk', 'PolyDataIOs'),
          },
        
      ]),
    ],
    performance: {
        maxAssetSize: 10000000
    }
  },


  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "jupyter_vtk",
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
  },



];
