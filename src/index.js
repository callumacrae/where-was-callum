require('dotenv').config();

var express = require('express');

var app = express();
app.listen(3000, () => console.log('Now listening on port 3000'));

var validateLocationData = require('./validateLocationData');

// THIS FILE IS BASICALLY JUST DEV CODE RN PLS IGNORE

var platform = require('./platforms/mondo');

if (platform.getRoutes) {
	app.use(platform.getRoutes());
}

platform.getStatus()
	.then(function (status) {
		if (status === 'unauthed') {
			throw new Error('please auth')
		}

		return platform.getLocations({ count: 5 });
	})
	.then(validateLocationData)
	.then(function (locations) {
		console.log(locations);
	})
	.catch((err) => console.error(err));

