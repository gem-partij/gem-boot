const dbConfig = require("../config/database");
const driverLoader = require("./DriverLoader");

class ConnectionManager {
	constructor(config = null) {
		if (!config) {
			config = dbConfig;
		}
		this._defaultConnectionName = config.default;
		this._connectionConfig =
			config.connections[this._defaultConnectionName];

		this._connection = null;
	}

	get defaultConnectionName() {
		return this._defaultConnectionName;
	}

	get connectionConfig() {
		return this._connectionConfig;
	}

	get driver() {
		const driver = driverLoader.load(this.connectionConfig.driver);
		return driver;
	}

	set connection(conn) {
		this._connection = conn;
	}

	get connection() {
		return this._connection;
	}

	connect() {
		this.connection = this.driver.connect(this.connectionConfig);
		return this.connection;
	}

	connectURI(URI = null) {
		if (!URI) {
			URI = this.connectionConfig.url;
		}
		this.connection = this.driver.connectURI(URI);
		return this.connection;
	}
}

module.exports = ConnectionManager;
