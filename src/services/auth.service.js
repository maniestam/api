const config = require("../config/config");
const jwt = require("jsonwebtoken");

const secret = config.jwtSecret;

const authService = () => {
	const issue = payload => jwt.sign({ data: payload }, secret, { expiresIn: config.jwtTokenExpire });

	const verify = (token, cb) => jwt.verify(token, secret, cb);

	const decode = token => jwt.decode(token);

	return {
		issue,
		verify,
		decode
	};
};

module.exports = authService;
