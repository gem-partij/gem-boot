const fs = require("fs");
const path = require("path");

const configPath = () => {
	return path.join(process.cwd(), "config");
};

const loggingConfigPath = () => {
	return path.join(configPath(), "logging");
};

const loggerConfig = (configPath = null) => {
	if (!configPath) {
		configPath = loggingConfigPath();
	}
	const config = require(configPath);
	const gembootLogPath = path.join(process.cwd(), config.path);

	const logDirectory = gembootLogPath;

	const logErrorDirectory = path.join(logDirectory, "error");

	// ensure log directory exists
	fs.existsSync(logErrorDirectory) || fs.mkdirSync(logErrorDirectory);

	return {
		level: config.level,
		logPath: logErrorDirectory
	};
};

module.exports = {
	configPath,
	loggingConfigPath,
	loggerConfig
};
