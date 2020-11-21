const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('../webpack.config');

module.exports = {
  entry: './demo/index.jsx',
  output: {
    path: path.resolve('./dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: baseConfig.module,
  plugins: [new HtmlWebpackPlugin()]
};
