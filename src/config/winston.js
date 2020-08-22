
const winston = require("winston");

const config = require("../config/config");

let logdata = [
	new winston.transports.File({
		name: 'access-file',
		filename: 'access-info.log',
		level: 'info' 
	}),
	new winston.transports.File({
		name: 'access-file',
		filename: 'access-error.log',
		level: 'error' 
	})
];
if (config.env == 'local' || config.env == 'development' ||
	config.env == 'DEV') {
	logdata.push(new winston.transports.Console({
		json: true,
		colorize: true
	}));
}
const logger = winston.createLogger({
	transports: logdata,
	exitOnError: false,
});
module.exports = logger;
