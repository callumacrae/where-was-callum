var qs = require('querystring');
var mondo = require('mondo-bank');
var got = require('got');

const clientId = process.env.MONDO_CLIENT_ID;
const clientSecret = process.env.MONDO_CLIENT_SECRET;

exports.getStatus = function (req) {
	const returnObj = (authed) => ({ service: 'Monzo', authed });

	if (!req.session || !req.session.mondo) {
		return Promise.resolve(returnObj(false));
	}

	return got.get('https://api.monzo.com/ping/whoami', {
		json: true,
		headers: {
			Authorization: `Bearer ${req.session.mondo.access_token}`
		}
	})
		.then((res) => returnObj(res.body.authenticated))
		.catch(() => refresh(req))
		.then(() => returnObj(true))
		.catch(() => returnObj(false));
};

exports.getRedirectUrl = function () {
	return 'https://auth.getmondo.co.uk/?' + qs.stringify({
			client_id: clientId,
			redirect_uri: 'http://localhost:8080/oauth/callback/mondo',
			response_type: 'code'
		});
};

exports.authorize = function (token, req) {
	return got.post('https://api.monzo.com/oauth2/token', {
		json: true,
		body: {
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: 'http://localhost:8080/oauth/callback/mondo',
			code: token
		}
	})
		.then((res) => {
			req.session.mondo = res.body;
			return mondo.accounts(req.session.mondo.access_token);
		})
		.then((data) => {
			req.session.mondoAccounts = data.accounts;
		});
};

function refresh(req) {
	return got.post('https://api.monzo.com/oauth2/token', {
		json: true,
		body: {
			grant_type: 'refresh_token',
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: req.session.mondo.refresh_token
		}
	})
		.then((res) => {
			req.session.mondo = res.body;
		});
}

exports.getLocations = function (options, req) {
	options = Object.assign({
		since: new Date(2016, 0, 1),
		retry: true
	}, options);

	var accountId = req.session.mondoAccounts[0].id;
	var accessToken = req.session.mondo.access_token;

	return mondo.transactions({
		account_id: accountId,
		'expand[]': 'merchant',
		since: options.since.toISOString()
	}, accessToken)
		.then(function ({ transactions }) {
			return transactions
				.map(function (transaction) {
					if (!transaction.merchant || !transaction.merchant.address) {
						return;
					}

					// ATM locations are often wrong
					if (transaction.merchant.online || transaction.merchant.atm) {
						return;
					}

					const shitlist = [
						'Mamouns Falafel',
						'O.co/overstock.com 800',
						'Amazon Digital Downloads',
						'Queens Ice And Bowl'
					];

					if (shitlist.includes(transaction.merchant.name.trim())) {
						return;
					}

					// For some reason, a few transactions ended up over here
					const address = transaction.merchant.address;
					if (address.latitude === 44.200797 && address.longitude === 24.5022981) {
						return;
					}

					return {
						place: transaction.merchant.name.trim(),
						time: new Date(transaction.created),
						service: 'mondo',
						location: {
							lat: address.latitude,
							lng: address.longitude
						}
					};
				})
				// Remove undefined elements
				.filter((transaction) => transaction);
		})
		.catch((err) => {
			// @todo: check err status code and test this code

			if (options.retry) {
				options.retry = false;
				return refresh(req).then(() => exports.getLocations(options, req));
			} else {
				return Promise.reject(err);
			}
		});
};
