var path = require('path');
var webpack = require('webpack');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue',
    },
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')],
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  vue: {
    loaders: utils.cssLoaders(),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BASE_API': JSON.stringify(process.env.BASE_API),
    }),
  ],
};
