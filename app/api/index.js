var express = require('express');
var api = module.exports = express.Router();

var validateLocationData = require('./validateLocationData');

api.get('/', function (req, res) {
	res.send('OK');
});

api.get('/locations/:id', function (req, res) {
	const service = require('../platforms')[req.params.id];

	service.getLocations({}, req)
		.then(validateLocationData)
		.then((data) => res.send(data))
		.catch((err) => res.status(500).send(err));
});
