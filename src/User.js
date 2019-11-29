// User.js


const jwtDecode = require('jwt-decode')

class User {
	static decodeToken(token) {
		let verification = jwtDecode(token)
		return verification
	}
}


export default User;