var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: true, extract: true }),
  },
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: true,
      extract: true
    })
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: true,
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin('static/css/[name].[contenthash].css'),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
  ]
});

module.exports = webpackConfig;
