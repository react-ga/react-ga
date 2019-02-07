const path = require('path');
const pkg = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'react-ga': './src/index.js',
    'react-ga.min': './src/index.js',
    'react-ga-noreact': './src/noreact.js',
    'react-ga-noreact.min': './src/noreact.js'
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this' // temporary fix for https://github.com/webpack/webpack/issues/6525
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
