require("dotenv").config();

const Sequelize = require("sequelize");
const mongoose = require("mongoose");

const conn = require("../utils/database").connection;

class Model {
	init() {
		this._table = "tablename";
		this._primaryKey = "id";
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

	get queryBuilder() {
		if (process.env.DB_TYPE == "mongodb") {
			return this.ODM();
		} else {
			return this.ORM();
		}
	}

	// For SQL (MySQL, Postgre, etc)
	ORM() {
		const ORM = conn.define(this.table, this.attributes, {
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: false
		});
		return ORM;
	}

	// For NoSQL (MongoDB, etx)
	ODM() {
		const schema = new mongoose.Schema(this.attributes);
		const ODM = mongoose.model(this.table, schema);
		return ODM;
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
