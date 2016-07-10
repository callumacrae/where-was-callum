var Joi = require('joi');

var schema = Joi.array().items(
	Joi.object().keys({
		place: Joi.string(),
		time: Joi.date(),
		service: Joi.string(),
		location: Joi.object().keys({
			lat: Joi.number(),
			lng: Joi.number()
		}).unknown(true),

		extras: Joi.object().optional()
	})
);

function validateLocationData(locations) {
	return new Promise(function (resolve, reject) {
		Joi.validate(locations, schema, function (err, val) {
			if (err) {
				return reject(err);
			}

			resolve(val);
		});
	});
}

module.exports = validateLocationData;
