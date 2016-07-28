require('dotenv').config();

var express = require('express');

var app = express();

app.use(express.static('public'));

app.use('/api', require('./api'));

app.get('*', function (req, res, next) {
	var extension = /\.([a-z]+)$/.exec(req.path);
	if (extension && extension[1] !== 'html') {
		return next();
	}

	res.sendFile('public/index.html', { root: process.cwd() });
});

app.listen(3000, () => console.log('Now listening on port 3000'));
