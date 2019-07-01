const fs = require("fs");
const path = require("path");
const env = require("./env");

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
	const config = require(configPath);
	const gembootLogPath = path.join(process.cwd(), config.path);

	const logDirectory = gembootLogPath;

	const logErrorDirectory = path.join(logDirectory, "error");

	// ensure log directory exists
	fs.existsSync(logErrorDirectory) || fs.mkdirSync(logErrorDirectory);

	const logger = require("./logger")({
		level: config.level,
		logPath: logErrorDirectory
	});

	app.use((err, req, res, next) => {
		logger.error(err.stack);
		next(err);
	});

	app.use(clientErrorHandler);
	app.use(errorHandler);
};

module.exports = { register: registerErrorHandler };
