const Sequelize = require("sequelize");
const debug = require("debug")("app:db");

const connect = config => {
	const conn = new Sequelize(
		config.database,
		config.username,
		config.password,
		{
			host: config.host,
			dialect: config.driver
		}
	);

	conn.authenticate()
		.then(() => {
			debug(
				"Connection to DB[" +
					config.driver +
					"] has been established successfully."
			);
		})
		.catch(err => {
			console.error("Unable to connect to the database:", err);
		});

	return conn;
};

const connectURI = URI => {
	return new Sequelize(URI);
};

const vendor = () => {
	return Sequelize;
};

const isRelational = () => {
	return true;
};

module.exports = {
	connect,
	connectURI,
	vendor,
	isRelational
};
