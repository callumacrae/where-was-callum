var mondo = require('mondo-bank');

exports.getLocations = function (options) {
	options = Object.assign({
		since: new Date(Date.now() - 24 * 3600 * 1000)
	}, options);

	var accountId = process.env.MONDO_ACCOUNT_ID;
	var accessToken = process.env.MONDO_ACCESS_TOKEN;

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

// Can't figure out the oauth stuff right now, so just set MONDO_ACCESS_TOKEN
// from the playground
exports.getStatus = function () {
	return Promise.resolve('authed');
};
