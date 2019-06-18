require("dotenv").config();

const Sequelize = require("sequelize");

class Model {
	init() {
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

	get dbType() {
		return process.env.DB_TYPE;
	}

	get isRelational() {
		return process.env.DB_TYPE == "mongodb" ? false : true;
	}

	get queryBuilder() {
		if (!this.isRelational) {
			return this.ODM();
		} else {
			return this.ORM();
		}
	}

	get connection() {
		const conn = require("../utils/database").connection;
		return conn;
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
