var express = require('express');
var redisClient = require('redis').createClient();
var foursquare = require('node-foursquare')({
	secrets : {
		clientId : process.env.FOURSQUARE_CLIENT_ID,
		clientSecret : process.env.FOURSQUARE_CLIENT_SECRET,
		redirectUrl : 'http://localhost:3000/foursquare-callback'
	}
});

exports.getRoutes = function () {
	var router = express.Router();

	router.get('/foursquare-login', function (req, res) {
		res
			.status(303)
			.set('Location', foursquare.getAuthClientRedirectUrl())
			.end();
	});

	router.get('/foursquare-callback', function (req, res) {
		foursquare.getAccessToken({
			code: req.query.code
		}, function (err, accessToken) {
			if (err) {
				res.send(err);
			} else {
				redisClient.set('redis-access-token', accessToken);
				res.send(true)
			}
		});
	});

	return router;
};

exports.getLocations = function (options) {
	options = Object.assign({
		since: new Date(Date.now() - 24 * 3600 * 1000)
	}, options);

	if (options.count > 100) {
		return Promise.reject(new Error('Pagination is not yet supported'));
	}

	return new Promise(function (resolve, reject) {
		redisClient.get('redis-access-token', function (err, token) {
			if (err) {
				return reject(err);
			}

			if (!token) {
				return reject(new Error('Missing foursquare auth token'));
			}

			foursquare.Users.getCheckins('self', {
				afterTimestamp: Math.floor(options.since.getTime() / 1000)
			}, token, function (err, { checkins: { items } }) {
				if (err) {
					return reject(err);
				}

				items = items.map((checkin) => ({
					place: checkin.venue.name,
					time: new Date(checkin.createdAt),
					service: 'foursquare',
					location: checkin.venue.location
				}));

				resolve(items);
			})
		});
	});
};

// Return either "authed" or "unauthed"
exports.getStatus = function () {
	return new Promise(function (resolve, reject) {
		redisClient.get('redis-access-token', function (err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res ? 'authed' : 'unauthed');
			}
		});
	});
};
