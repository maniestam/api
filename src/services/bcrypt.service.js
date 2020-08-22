const bcrypt = require("bcrypt");
const saltRounds = 10;

const bcryptService = () => {
	// const password = (user) => {
	// 	const salt = bcrypt.genSaltSync(saltRounds);
	// 	const hash = bcrypt.hashSync(user, salt);
	// 	return hash;
	// };
	function password(pwd){
		const salt = bcrypt.genSaltSync(saltRounds);
			const hash = bcrypt.hashSync(pwd, salt);
			return hash;
	
	}


	const comparePassword = (pw, hash) => bcrypt.compareSync(pw, hash);

		return {
		password,
		comparePassword,
		
	};
};

module.exports = bcryptService;
