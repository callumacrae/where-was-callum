require('dotenv').config();

var express = require('express');

var app = express();
app.listen(3000, () => console.log('Now listening on port 3000'));

var validateLocationData = require('./validateLocationData');

// THIS FILE IS BASICALLY JUST DEV CODE RN PLS IGNORE

var foursquare = require('./platforms/foursquare');

app.use(foursquare.getRoutes());

foursquare.getStatus()
	.then(function (status) {
		if (status === 'unauthed') {
			throw new Error('Foursquare unauthed: http://localhost:3000/foursquare-login')
		}

		return foursquare.getLocations({ count: 3 });
	})
	.then(validateLocationData)
	.then(function (locations) {
		console.log(locations);
	})
	.catch((err) => console.error(err));
