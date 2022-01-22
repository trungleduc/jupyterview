const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js'],
    alias: {
      './itkConfig$': path.resolve(__dirname, 'lib', 'itkConfigJupyter.js')
    },
    fallback: { fs: false, path: false, url: false, module: false },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
          to: path.join(
            __dirname,
            'jupyterview',
            'labextension',
            'static',
            'itk',
            'WebWorkers'
          )
        },
        {
          from: path.join(
            __dirname,
            'node_modules',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReader.js'
          ),
          to: path.join(
            __dirname,
            'jupyterview',
            'labextension',
            'static',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReader.js'
          )
        },
        {
          from: path.join(
            __dirname,
            'node_modules',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReaderWasm.js'
          ),
          to: path.join(
            __dirname,
            'jupyterview',
            'labextension',
            'static',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReaderWasm.js'
          )
        },
        {
          from: path.join(
            __dirname,
            'node_modules',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReaderWasm.wasm'
          ),
          to: path.join(
            __dirname,
            'jupyterview',
            'labextension',
            'static',
            'itk',
            'PolyDataIOs',
            'VTKXMLFileReaderWasm.wasm'
          )
        }
      ]
    })
  ],
  performance: {
    maxAssetSize: 10000000
  }
};
