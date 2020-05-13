const path = require('path');
const version = require('./package.json').version;
const CopyPlugin = require('copy-webpack-plugin')

// Custom webpack rules
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.core.rules;
const rules = [
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  {test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    loader: 'url-loader?limit=100000'}
].concat(vtkRules);

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base', "@jupyterlab/apputils", "react", "@jupyterlab/application", "@jupyterlab/notebook", "@jupyter-widgets/controls", "@jupyterlab/services", "@lumino/coreutils", "redux", "react-redux", "redux-thunk"];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: [".webpack.js", ".web.js", ".js"],
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
    entry: './lib/extension.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'jupyterview', 'nbextension', 'static'),
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
   * Embeddable jupyterview bundle
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
        library: "jupyterview",
        publicPath: 'https://unpkg.com/jupyterview@' + version + '/dist/'
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
        to: path.join(__dirname, 'jupyterview', 'nbextension', 'static','itk', 'WebWorkers'),
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk', 'PolyDataIOs', 'VTKXMLFileReader.js'),
          to: path.join(__dirname, 'jupyterview', 'nbextension' , 'static','itk', 'PolyDataIOs','VTKXMLFileReader.js'),
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk', 'PolyDataIOs', 'VTKXMLFileReaderWasm.js'),
          to: path.join(__dirname, 'jupyterview', 'nbextension' , 'static','itk', 'PolyDataIOs','VTKXMLFileReaderWasm.js'),
        },
        {
          from: path.join(__dirname, 'node_modules', 'itk', 'PolyDataIOs', 'VTKXMLFileReaderWasm.wasm'),
          to: path.join(__dirname, 'jupyterview', 'nbextension' , 'static','itk', 'PolyDataIOs','VTKXMLFileReaderWasm.wasm'),
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
    entry: './lib/index.js',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "jupyterview",
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
