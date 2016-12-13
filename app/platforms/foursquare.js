var express = require('express');
var foursquare = require('node-foursquare')({
	secrets : {
		clientId : process.env.FOURSQUARE_CLIENT_ID,
		clientSecret : process.env.FOURSQUARE_CLIENT_SECRET,
		redirectUrl : 'http://localhost:8080/oauth/callback/foursquare'
	}
});

exports.getRedirectUrl = function () {
	return foursquare.getAuthClientRedirectUrl();
};

exports.authorize = function (token, req) {
	return new Promise(function (resolve, reject) {
		foursquare.getAccessToken({
			code: token
		}, function (err, accessToken) {
			if (err) {
				reject(err);
			} else {
				req.session.redisToken = accessToken;
				resolve();
			}
		});
	});
};


exports.getLocations = function (options, req) {
	options = Object.assign({
		since: new Date(Date.now() - 7 * 24 * 3600 * 1000)
	}, options);

	return new Promise(function (resolve, reject) {
		const token = req.session.redisToken;

		foursquare.Users.getCheckins('self', {
			afterTimestamp: Math.floor(options.since.getTime() / 1000)
		}, token, function (err, { checkins: { items } }) {
			if (err) {
				return reject(err);
			}

			items = items.map((checkin) => ({
				place: checkin.venue.name,
				time: new Date(checkin.createdAt * 1000),
				service: 'foursquare',
				location: checkin.venue.location
			}));

			resolve(items);
		});
	});
};
