const Sequelize = require("sequelize");
const db = require("../utils/database").sequelize;

class Model {
	init() {
		this._table = "tablename";
		this._primaryKey = "id";
		this._attributes = {};

		this._protected = ["created_at", "updated_at"];
		this._unprotected = ["id", "created_at", "updated_at"]
			.concat(Object.keys(this._attributes))
			.filter(attr => {
				return !this._protected.includes(attr);
			});
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

	get ORM() {
		const ORM = db.define(this.table, this.attributes, {
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: false
		});
		return ORM;
	}
}

module.exports = Model;
