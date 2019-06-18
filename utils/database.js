require("dotenv").config();

const debug = require("debug")("app:db");
const isRelational = process.env.DB_TYPE != "mongodb";

const getMigrations = () => {
	return !isRelational ? null : require("knex")(require("../knexfile"));
};

const getConnection = () => {
	if (!isRelational) {
		const mongoose = require("mongoose");

		if (mongoose.connection.readyState) {
			return mongoose.connection;
		} else {
			let uri =
				"mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;
			if (process.env.DB_USER && process.env.DB_PASS) {
				uri =
					"mongodb://" +
					process.env.DB_USER +
					":" +
					process.env.DB_PASS +
					"@" +
					process.env.DB_HOST +
					":" +
					process.env.DB_PORT +
					"/" +
					process.env.DB_NAME +
					"";
			}

			const conn = mongoose.createConnection(uri, {
				useNewUrlParser: true
			});

			conn.on("error", console.error.bind(console, "connection error:"));
			conn.once("open", () => {
				debug(
					"Connection to MongoDB has been established successfully."
				);
			});

			return conn;
		}
	} else {
		const Sequelize = require("sequelize");

		const conn = new Sequelize(
			process.env.DB_NAME,
			process.env.DB_USER,
			process.env.DB_PASS,
			{
				host: process.env.DB_HOST,
				dialect: process.env.DB_TYPE
			}
		);

		conn.authenticate()
			.then(() => {
				debug(
					"Connection to DB[" +
						process.env.DB_TYPE +
						"] has been established successfully."
				);
			})
			.catch(err => {
				console.error("Unable to connect to the database:", err);
			});

		return conn;
	}
};

module.exports = {
	knex: getMigrations(),
	connection: getConnection()
};
