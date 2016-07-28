var path = require('path');

module.exports = {
	entry: ['./client/script.js'],
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'assets/script.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['react', 'es2015']
			}
		}]
	},
	plugins: []
};