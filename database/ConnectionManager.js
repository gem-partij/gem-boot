const dbConfig = require("../config/database");
const driverLoader = require("./DriverLoader");

class ConnectionManager {
	constructor(config = null) {
		if (!config) {
			config = dbConfig;
		}
		this.databaseConfig = config;

		this.defaultConnectionName = this.databaseConfig.default;
		this.connection = null;
	}

	set databaseConfig(databaseConfig) {
		this._databaseConfig = databaseConfig;
	}

	get databaseConfig() {
		return this._databaseConfig;
	}

	set defaultConnectionName(defaultConnectionName) {
		this._defaultConnectionName = defaultConnectionName;
		this._connectionConfig = this._databaseConfig.connections[
			this._defaultConnectionName
		];
	}

	get defaultConnectionName() {
		return this._defaultConnectionName;
	}

	set connectionConfig(connectionConfig) {
		this._connectionConfig = connectionConfig;
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

	resolveConnection(conn) {
		try {
			this.connection = conn;
		} catch (err) {
			throw err;
		} finally {
			return this.connection;
		}
	}

	connect() {
		return this.resolveConnection(
			this.driver.connect(this.connectionConfig)
		);
	}

	connectURI(URI = null) {
		if (!URI) {
			URI = this.connectionConfig.url;
		}
		return this.resolveConnection(this.driver.connectURI(URI));
	}
}

module.exports = ConnectionManager;
