const env = require("../utils/env");
const dbUtil = require("../utils/database");
const ConnectionManager = dbUtil.getConnectionManager();

class Model {
	init(connectionName = null, tableName = null, attributes = {}) {
		// set connection manager
		this.connectionManager = new ConnectionManager(
			process.env.GEMBOOT_CONFIG_PATH
				? require(process.env.GEMBOOT_CONFIG_PATH + "/database")
				: null
		);

		// set connection name
		if (connectionName) {
			this.connectionName = connectionName;
		} else {
			this.connectionName = this.connectionManager.defaultConnectionName;
		}

		// set connection
		this._connection = null;

		// set table name
		if (tableName) {
			this.table = tableName;
		} else {
			this.table = "tablename";
		}

		// set primary key
		this.primaryKey = this.isRelational ? "id" : "_id";

		// set attributes
		this.attributes = attributes;

		this._protected = ["created_at", "updated_at"];

		this._unprotected = this.generateUnprotectedAttributes();
	}

	constructor(connectionName = null, tableName = null, attributes = {}) {
		this.init(connectionName, tableName, attributes);
	}

	set table(table) {
		this._table = table;
	}

	get table() {
		return this._table;
	}

	set attributes(attr) {
		this._attributes = attr;
	}

	get attributes() {
		return this._attributes;
	}

	set primaryKey(key) {
		this._primaryKey = key;
	}

	get primaryKey() {
		return this._primaryKey;
	}

	set protectedAttributes(protectedAttr) {
		this._protected = protectedAttr;
	}

	get protectedAttributes() {
		return this._protected;
	}

	set unprotectedAttributes(unprotected) {
		this._unprotected = unprotected;
	}

	get unprotectedAttributes() {
		return this._unprotected;
	}

	set connectionName(connectionName) {
		this._connectionName = connectionName;
		this.connectionManager.defaultConnectionName = connectionName;
	}

	get connectionName() {
		return this._connectionName;
	}

	set connectionManager(manager) {
		this._connectionManager = manager;
	}

	get connectionManager() {
		return this._connectionManager;
	}

	set connection(conn) {
		this._connection = conn;
	}

	get connection() {
		if (!this._connection) {
			this._connection = this.connectionManager.connect();
		}
		return this._connection;
	}

	get isRelational() {
		return this.connectionManager.driver.isRelational();
	}

	get queryBuilder() {
		if (!this.isRelational) {
			return this.ODM();
		} else {
			return this.ORM();
		}
	}

	// For SQL (MySQL, Postgre, etc)
	ORM() {
		try {
			const ORM = this.connection.define(this.table, this.attributes, {
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: false
			});
			return ORM;
		} catch (err) {
			throw err;
		}
	}

	// For NoSQL (MongoDB, etx)
	ODM() {
		try {
			const mongoose = require("mongoose");
			const schema = new mongoose.Schema(this.attributes);

			const conn = this.connection;
			const modelExists = conn.modelNames().find(el => {
				return el == this.table;
			});

			if (modelExists) {
				return this.connection.model(this.table);
			} else {
				return this.connection.model(this.table, schema);
			}
		} catch (err) {
			throw err;
		}
	}

	generateUnprotectedAttributes() {
		return [this.primaryKey, "created_at", "updated_at"]
			.concat(Object.keys(this.attributes))
			.filter(attr => {
				return !this.protectedAttributes.includes(attr);
			});
	}
}

module.exports = Model;
