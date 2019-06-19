const mongoose = require("mongoose");
const env = require("../../utils/env");
const debug = require("debug")("app:db");

const connect = config => {
	if (mongoose.connection.readyState) {
		return mongoose.connection;
	}

	let URI = "mongodb://" + config.host + "/" + config.database;
	if (config.username && config.password) {
		URI =
			"mongodb://" +
			config.username +
			":" +
			config.password +
			"@" +
			config.host +
			":" +
			config.port +
			"/" +
			config.database +
			"";
	}

	return connectURI(URI);
};

const connectURI = URI => {
	const conn = mongoose.createConnection(URI, {
		useNewUrlParser: true
	});

	conn.on("error", console.error.bind(console, "connection error:"));
	conn.once("open", () => {
		debug(
			"Connection to DB[" +
				env("DB_CONNECTION") +
				"] has been established successfully."
		);
	});

	return conn;
};

const vendor = () => {
	return mongoose;
};

const isRelational = () => {
	return false;
};

module.exports = {
	connect,
	connectURI,
	vendor,
	isRelational
};
