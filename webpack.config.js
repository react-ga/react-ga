const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');

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
    loaders: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};
