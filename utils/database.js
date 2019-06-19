const env = require("./env");

const isRelational = env("DB_TYPE").toUpperCase() == "SQL";

const getMigrations = () => {
	return !isRelational ? null : require("knex")(require("../knexfile"));
};

const getConnectionManager = () => {
	return require("../database/ConnectionManager");
};

module.exports = {
	knex: getMigrations(),
	getConnectionManager
};
