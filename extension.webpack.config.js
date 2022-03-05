const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

function copyPluginPatterns(fileList) {
  return fileList.map(file => ({
    from: path.join(__dirname, 'node_modules', 'itk', 'PolyDataIOs', file),
    to: path.join(
      __dirname,
      'jupyterview',
      'labextension',
      'static',
      'itk',
      'PolyDataIOs',
      file
    )
  }));
}

const itkConfig = path.resolve(__dirname, 'lib', 'itkConfig.js')
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
      './itkConfig$': itkConfig
    },
    fallback: { fs: false, path: false, url: false, module: false }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        ...copyPluginPatterns([
          'VTKXMLFileReader.js',
          'VTKXMLFileReaderWasm.js',
          'VTKXMLFileReaderWasm.wasm',
          'VTKLegacyFileReader.js',
          'VTKLegacyFileReaderWasm.js',
          'VTKLegacyFileReaderWasm.wasm',
        ]),
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
        }
      ]
    })
  ],
  performance: {
    maxAssetSize: 10000000
  },
  optimization: {
    minimize: false
  },
};
