var express = require('express');
var cache = require('apicache').middleware;
var api = module.exports = express.Router();

var validateLocationData = require('./validateLocationData');

api.get('/', function (req, res) {
	res.send('OK');
});

api.get('/locations', cache('30 minutes'), function (req, res) {
	const platforms = require('../platforms');

	Promise.all(Object.keys(platforms).map((platform) => platforms[platform].getLocations({}, req)))
		.then((datas) => {
			return datas
				.reduce((flatDatas, data) => flatDatas.concat(data), [])
				.sort((a, b) => a.time.getTime() - b.time.getTime()); // @todo: merge sort?
		})
		.then(validateLocationData)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});

api.get('/locations/:id', cache('30 minutes'), function (req, res) {
	const service = require('../platforms')[req.params.id];

	service.getLocations({}, req)
		.then(validateLocationData)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});