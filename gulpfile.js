var gulp = require('gulp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('webpack', function (cb) {
	webpackConfig.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	);

	webpack(webpackConfig, function (err, stats) {
		if (err) {
			throw err;
		}

		console.log(stats.toString({
			colors: true
		}));

		cb();
	});
});

gulp.task('webpack:dev', function (cb) {
	var WebpackDevServer = require('webpack-dev-server');

	webpackConfig.devtool = 'eval';
	webpackConfig.debug = true;

	webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080/');

	new WebpackDevServer(webpack(webpackConfig), {
		//hot: true,
		contentBase: webpackConfig.output.path,
		stats: {
			colors: true
		},
		proxy: {
			'*': {
				target: 'http://localhost:3000'
			}
		}
	}).listen(8080, function (err) {
		if (err) {
			throw err;
		}

		cb();
	});
});

gulp.task('nodemon', function (cb) {
	var nodemon = require('nodemon');

	var nodemonOpts = {
		script: 'app/index.js',
		watch: ['app']
	};

	nodemon(nodemonOpts)
		.on('start', () => console.log('App starting.'))
		.on('quit', function () {
			console.log('App has quit. Bye!');
			cb();
			process.exit(0);
		})
		.on('restart', () => console.log('App restarting due to change'));
});

gulp.task('watchers', gulp.parallel('webpack:dev', 'nodemon'));

gulp.task('build', gulp.series('webpack'));

gulp.task('default', gulp.series('watchers'));
