const mongoose = require("mongoose");
const env = require("../../utils/env");
const debug = require("debug")("app:db");

const connect = config => {
	if (mongoose.connection.readyState) {
		return mongoose.connection;
	}

	let URI =
		"mongodb://" + config.host + ":" + config.port + "/" + config.database;
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

const errHandler = err => {
	console.error("Unable to connect to mongo:", err);
	throw err;
};

const connectURI = URI => {
	// const conn = mongoose
	// 	.createConnection(URI, {
	// 		useNewUrlParser: true
	// 	})
	// 	.catch(errHandler);

	// conn.on("error", errHandler);
	// conn.once("open", () => {
	// 	debug("Connection to DB[mongodb] has been established successfully.");
	// });

	mongoose.connection.once("open", function() {
		debug("MongoDB event open");
		debug("MongoDB connected [%s]", url);

		mongoose.connection.on("connected", function() {
			debug("MongoDB event connected");
		});

		mongoose.connection.on("disconnected", function() {
			debug("MongoDB event disconnected");
		});

		mongoose.connection.on("reconnected", function() {
			debug("MongoDB event reconnected");
		});

		mongoose.connection.on("error", function(err) {
			debug("MongoDB event error: " + err);
		});

		return resolve();
	});

	return mongoose.connect(
		URI,
		{
			useNewUrlParser: true
		},
		errHandler
	);
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
