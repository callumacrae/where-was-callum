var express = require('express');
var api = module.exports = express.Router();

api.get('/status/all', function (req, res) {
	const platforms = require('./platforms');

	const servicePromises = Object.keys(platforms).map((platform) => {
		return platforms[platform].getStatus(req)
			.then(function (status) {
				if (!status.authed) {
					Object.assign(status, {
						authUrl: platforms[platform].getRedirectUrl()
					});
				}

				return status;
			});
	});

	Promise.all(servicePromises)
		.then((statuses) => res.send(statuses))
		.catch((err) => res.status(500).send(err));
});

api.get('/status/:id', function (req, res, next) {
	const service = require('./platforms')[req.params.id];

	service.getStatus(req)
		.then(function (status) {
			if (!status.authed) {
				Object.assign(status, {
					authUrl: service.getRedirectUrl()
				});
			}
			res.send(status);
		})
		.catch(next);
});

api.get('/authorize/:id', function (req, res) {
	const service = require('./platforms')[req.params.id];

	res.redirect(302, service.getRedirectUrl());
});

api.get('/callback/:id', function (req, res, next) {
	const service = require('./platforms')[req.params.id];

	service.authorize(req.query.code, req)
		.then(function () {
			res.redirect(302, '/');
		})
		.catch(next);
});