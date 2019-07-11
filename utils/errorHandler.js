const env = require("./env");
const getDefault = require("./getDefault");

const resSendError = (err, res) => {
	const standardMessage = "Oops! Something went wrong!";

	let message = standardMessage;
	if (env("APP_ENV") !== "production") {
		message = {
			error: standardMessage,
			message: err.message,
			stack: err.stack
		};
	}
	res.status(500).send(message);
};

const clientErrorHandler = (err, req, res, next) => {
	if (req.xhr) {
		resSendError(err, res);
	} else {
		next(err);
	}
};

const errorHandler = (err, req, res, next) => {
	// res.status(500);
	// res.render("error", { error: err });
	resSendError(err, res);
};

const registerErrorHandler = (app, configPath) => {
	const logger = require("./logger")(getDefault.loggerConfig(configPath));

	app.use((err, req, res, next) => {
		logger.error(err.stack);
		next(err);
	});

	app.use(clientErrorHandler);
	app.use(errorHandler);
};

module.exports = { register: registerErrorHandler };
