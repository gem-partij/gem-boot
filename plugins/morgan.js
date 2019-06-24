const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");

const run = (app, configPath) => {
	const config = require(configPath);
	const gembootLogPath = path.join(process.cwd(), config.path);

	const logDirectory = gembootLogPath;

	const logAccessDirectory = path.join(logDirectory, "access");
	const logErrorDirectory = path.join(logDirectory, "error");

	// ensure log directory exists
	fs.existsSync(logAccessDirectory) || fs.mkdirSync(logAccessDirectory);
	fs.existsSync(logErrorDirectory) || fs.mkdirSync(logErrorDirectory);

	// create a rotating write stream
	const accessLogStream = rfs("access.log", {
		interval: "1d", // rotate daily
		path: logAccessDirectory,
		maxFiles: config.days
	});
	const errorLogStream = rfs("error.log", {
		interval: "1d", // rotate daily
		path: logErrorDirectory,
		maxFiles: config.days
	});

	// console log
	app.use(morgan("tiny"));

	// log access to file
	app.use(
		morgan("combined", {
			skip: (req, res) => res.statusCode >= 400,
			stream: accessLogStream
		})
	);

	// log errors to file
	app.use(
		morgan("combined", {
			skip: (req, res) => res.statusCode < 400,
			stream: errorLogStream
		})
	);
};

module.exports = {
	run
};
