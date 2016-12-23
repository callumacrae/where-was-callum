import merge from 'deepmerge';

export default function request(url, options) {
	options = merge({
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	}, options || {});

	return fetch(url, options)
		.then((res) => res.json());
}