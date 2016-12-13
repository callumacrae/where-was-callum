var qs = require('querystring');
var mondo = require('mondo-bank');
var got = require('got');

const clientId = process.env.MONDO_CLIENT_ID;
const clientSecret = process.env.MONDO_CLIENT_SECRET;

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

exports.getLocations = function (options, req) {
	options = Object.assign({
		since: new Date(Date.now() - 7 * 24 * 3600 * 1000)
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

					return {
						place: transaction.merchant.name.trim(),
						time: new Date(transaction.created),
						service: 'mondo',
						location: {
							lat: transaction.merchant.address.latitude,
							lng: transaction.merchant.address.longitude
						}
					};
				})
				// Remove undefined elements
				.filter((transaction) => transaction);
		})
};
