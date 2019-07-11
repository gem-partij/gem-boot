const path = require("path");
const env = require("./env");
const getDefault = require("./getDefault");
const moment = require("moment-timezone");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;

const myTimestamp = () => moment().format("YYYY-MM-DD HH:mm:ss");

const myFormat = printf(info => {
	return `${myTimestamp()} [${info.level}]: ${info.message}`;
});

const logger = (configOpt = null) => {
	let level = null;
	let logPath = null;

	if (!configOpt) {
		const defaultConfig = getDefault.loggerConfig();
		level = defaultConfig.level;
		logPath = defaultConfig.logPath;
	} else {
		level = configOpt.level;
		logPath = configOpt.logPath;
	}

	const log = createLogger({
		level: level,
		format: myFormat,
		// defaultMeta: { service: "exceptions" },
		transports: [
			//
			// - Write to all logs with level `info` and below to `combined.log`
			// - Write all logs error (and below) to `error.log`.
			//
			new transports.File({
				filename: path.join(logPath, "errors.log"),
				level: "error",
				timestamp: true
			}),
			new transports.File({
				filename: path.join(logPath, "combined.log"),
				timestamp: true
			})
		],
		exceptionHandlers: [
			new transports.File({
				filename: path.join(logPath, "exceptions.log"),
				timestamp: true
			})
		],
		exitOnError: false
	});

	//
	// If we're not in production then log to the `console` with the format:
	// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
	//
	if (env("APP_ENV") !== "production") {
		log.add(
			new transports.Console({
				format: format.simple(),
				timestamp: true
			})
		);
	}

	return log;
};

module.exports = logger;
