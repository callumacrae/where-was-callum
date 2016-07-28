var express = require('express');
var api = module.exports = express.Router();

api.get('/', function (req, res) {
	res.send('OK');
});

//var validateLocationData = require('./validateLocationData');

// THIS FILE IS BASICALLY JUST DEV CODE RN PLS IGNORE

//var platform = require('./platforms/foursquare');
//
//if (platform.getRoutes) {
//	app.use(platform.getRoutes());
//}
//
//platform.getStatus()
//	.then(function (status) {
//		if (status === 'unauthed') {
//			throw new Error('please auth')
//		}
//
//		return platform.getLocations({
//			since: new Date(Date.now() - 3 * 24 * 3600 * 1000)
//		});
//	})
//	.then(validateLocationData)
//	.then(function (locations) {
//		console.log(locations);
//	})
//	.catch((err) => console.error(err));