import jwt_decode from 'jwt-decode'

export const memoize = fn => {
	let cache = {}

	return (...args) => {
		let n = args[0] // just taking one argument here

		if (n in cache) {
			return cache[n]
		} else {
			let result = fn(n)
			cache[n] = result

			return result
		}
	}
}

export const getDecodedToken = () => {
	return jwt_decode(localStorage.getItem('pb_user_token'))
}
