var shelljs = require('shelljs');
var path = require('path');
var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.conf');

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
);

var spinner = ora('building for production...');
spinner.start();

var assetsPath = path.join(__dirname, '../dist/static');
shelljs.rm('-rf', assetsPath);
shelljs.mkdir('-p', assetsPath);
shelljs.cp('-R', 'static/', assetsPath);

webpack(webpackConfig, (err, stats) => {
  spinner.stop();
  if (err) {
    throw err;
  }
  console.log(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }));
});
