class Repository {
	init() {
		this._model = null;
		this._orm = null;
	}

	constructor() {
		if (new.target === Repository) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		this.init();
	}

	set model(model) {
		if (Object.getPrototypeOf(model.constructor).name !== "Model") {
			throw new Error("Model must extends gemboot.Model");
		}
		this._model = model;
		this.orm = model.ORM;
	}

	get model() {
		return this._model;
	}

	set orm(orm) {
		this._orm = orm;
	}

	get orm() {
		return this._orm;
	}
}

module.exports = Repository;
