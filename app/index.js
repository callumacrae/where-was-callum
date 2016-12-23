require('dotenv').config();

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('../build/webpack.dev.conf');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 8080;

var app = express();

app.use(session({
	secret: process.env.HTTP_SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store: new RedisStore({
		host: '127.0.0.1',
		port: 6379
	})
}));

app.use('/api', require('./api'));
app.use('/oauth', require('./oauth'));

var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	},
});

var hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
		hotMiddleware.publish({ action: 'reload' });
		cb();
	});
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
app.use('/static', express.static('./static'));

module.exports = app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:' + port + '\n');
});
