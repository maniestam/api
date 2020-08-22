const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
// const httpStatus = require("http-status");
const expressWinston = require("express-winston");
const expressValidation = require("express-validation");
const helmet = require("helmet");
const winstonInstance = require("./winston");
const routes = require("../routes/index.route");
const config = require("./config");
const APIError = require("../helpers/APIError");
const multer = require("multer");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const fs = require("fs");
const request = require("request");
const moment = require("moment");
const app = express();

if (config.env === "development") {
	app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());



app.use("/assets", express.static(path.join(__dirname, "../uploads")));

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
	if (err instanceof expressValidation.ValidationError) {
		// validation error contains errors which is an array of error each containing message[]
		const unifiedErrorMessage = err.errors.map(error => error.messages.join(". ")).join(" and ");
		const error = new APIError(unifiedErrorMessage, err.status, true);
		return next(error);
	} else if (!(err instanceof APIError)) {
		const apiError = new APIError(err.message, err.status, err.isPublic);
		return next(apiError);
	}
	return next(err);
});



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// mount all routes on /api path
app.use("/", routes);

module.exports = app;
// all good