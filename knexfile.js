const env = require("./utils/env");

module.exports = {
	client: env("DB_DRIVER", "mysql"),
	connection: {
		host: env("DB_HOST", "127.0.0.1"),
		user: env("DB_USER", "root"),
		password: env("DB_PASS", ""),
		database: env("DB_NAME", "test")
	}
};
