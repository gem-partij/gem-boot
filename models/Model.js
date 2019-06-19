const env = require("../utils/env");
const dbUtil = require("../utils/database");
const ConnectionManager = dbUtil.getConnectionManager();

class Model {
	init() {
		this._connectionManager = new ConnectionManager(
			process.env.GEMBOOT_CONFIG_PATH
				? require(process.env.GEMBOOT_CONFIG_PATH + "/database")
				: null
		);
		this._connectionName = this.connectionManager.defaultConnectionName;
		this._connection = null;

		this._table = "tablename";

		this._primaryKey = !this.isRelational ? "_id" : "id";

		this._attributes = {};

		this._protected = ["created_at", "updated_at"];

		this._unprotected = this.generateUnprotectedAttributes();
	}

	constructor() {
		this.init();
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
		const ORM = this.connection.define(this.table, this.attributes, {
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: false
		});
		return ORM;
	}

	// For NoSQL (MongoDB, etx)
	ODM() {
		const mongoose = require("mongoose");
		const schema = new mongoose.Schema(this.attributes);

		const modelExists = this.connection.modelNames().find(el => {
			return el == this.table;
		});

		if (modelExists) {
			return this.connection.model(this.table);
		} else {
			return this.connection.model(this.table, schema);
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
