const path = require('path');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'react-ga': './src/index.js',
    'react-ga.min': './src/index.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  externals: []
    .concat(Object.keys(pkg.peerDependencies))
    .concat(Object.keys(pkg.dependencies)),
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};
