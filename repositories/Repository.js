require("dotenv").config();

class Repository {
	init() {
		this._model = null;
		this._query = null;
	}

	constructor(Model = null) {
		if (new.target === Repository) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		if (!Model) {
			throw new Error("Model cannot be empty");
		}

		this.init();
		this.model = new Model();
		this[this.model.constructor.name] = this.query;
	}

	set model(model) {
		if (Object.getPrototypeOf(model.constructor).name !== "Model") {
			throw new Error("Model must extends gemboot.Model");
		}
		this._model = model;
		this._query = model.queryBuilder;
	}

	get model() {
		return this._model;
	}

	get query() {
		return this._query;
	}

	get dbType() {
		return process.env.DB_TYPE;
	}

	get isRelational() {
		return process.env.DB_TYPE == "mongodb" ? false : true;
	}
}

module.exports = Repository;
