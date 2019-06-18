require("dotenv").config();

class Repository {
	init(Model = null) {
		this._modelClass = Model;
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

		this.init(Model);
		this.model = new Model();
	}

	set model(model) {
		if (Object.getPrototypeOf(model.constructor).name !== "Model") {
			throw new Error("Model must extends gemboot.Model");
		}
		this._model = model;
		this._query = model.queryBuilder;
		this[this._model.constructor.name] = this._query;
	}

	get model() {
		return this._model;
	}

	get query() {
		return this._query;
	}

	get newModel() {
		this.model.connection.close();
		// this._model = null;

		this.model = new this._modelClass();
		return this.model;
	}

	get newQuery() {
		return this.newModel.queryBuilder;
	}

	get dbType() {
		return this.model.dbType;
	}

	get isRelational() {
		return this.model.isRelational;
	}
}

module.exports = Repository;
