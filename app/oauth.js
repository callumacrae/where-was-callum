var express = require('express');
var api = module.exports = express.Router();

api.get('/authorize/:id', function (req, res) {
	const service = require('./platforms')[req.params.id];

	res.redirect(302, service.getRedirectUrl());
});

api.get('/callback/:id', function (req, res) {
	const service = require('./platforms')[req.params.id];

	service.authorize(req.query.code, req)
		.then(function () {
			res.send('yay, go to homepage');
		})
		.catch(function (e) {
			console.error(e);
			res.status(500).send(e);
		})
});