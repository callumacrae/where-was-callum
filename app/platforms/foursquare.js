var express = require('express');
var foursquare = require('node-foursquare')({
	secrets : {
		clientId: process.env.FOURSQUARE_CLIENT_ID,
		clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
		redirectUrl: 'http://localhost:8080/oauth/callback/foursquare'
	}
});

exports.getStatus = function (req) {
	// Foursquare access tokens do not expire unless revoked
	return Promise.resolve({
		service: 'Foursquare',
		authed: !!(req.session && req.session.foursquareToken)
	});
};

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
				req.session.foursquareToken = accessToken;
				resolve();
			}
		});
	});
};


exports.getLocations = function (options, req) {
	options = Object.assign({
		since: new Date(2016, 0, 1),
		offset: 0
	}, options);

	return new Promise(function (resolve, reject) {
		const token = req.session.foursquareToken;

		foursquare.Users.getCheckins('self', {
			afterTimestamp: Math.floor(options.since.getTime() / 1000),
			limit: 250,
			offset: options.offset
		}, token, function (err, { checkins: { count, items } }) {
			if (err) {
				return reject(err);
			}

			items = items.map((checkin) => ({
				place: checkin.venue.name,
				time: new Date(checkin.createdAt * 1000),
				service: 'foursquare',
				location: checkin.venue.location
			}));

			// The 10 is so that there's no risk of making an infinite loop
			if (count < items.length + options.offset + 10) {
				resolve(items);
			} else {
				options.offset += 250;
				exports.getLocations(options, req)
					.then((newCheckins) => {
						resolve(items.concat(newCheckins));
					});
			}
		});
	});
};
