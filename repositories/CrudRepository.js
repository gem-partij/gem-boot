const Repository = require("./Repository");

class CrudRepository extends Repository {
	constructor(Model = null) {
		super(Model);

		if (new.target === CrudRepository) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		const mustOverride = ["getAll", "getOne", "insert", "update", "delete"];

		for (var i = 0; i < mustOverride.length; i++) {
			if (this[mustOverride[i]] === undefined) {
				throw new TypeError("Must override " + mustOverride[i]);
			}
		}
	}

	getAll(options = null) {
		if (this.isRelational) {
			if (options === null) {
				options = {
					limit: 30,
					offset: 0,
					order: [["id", "DESC"]],
					attributes: this.model.unprotectedAttributes
				};
			}
			return this.query.findAll(options);
		} else {
			return this.query.find().exec();
		}
	}

	getOne(id) {
		if (this.isRelational) {
			return this.query.findByPk(id, {
				attributes: this.model.unprotectedAttributes
			});
		} else {
		}
	}

	insert(data) {
		if (this.isRelational) {
			return this.query.create(data);
		} else {
		}
	}

	update(data, id) {
		if (this.isRelational) {
			const row = this.query.findByPk(id);
			const keys = data.keys();

			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				row.set(k, data[k]);
			}
			return row.save();
		} else {
		}
	}

	delete(id) {
		if (this.isRelational) {
			const pk = this.model.primaryKey;
			return this.query.destroy({
				where: {
					[pk]: id
				}
			});
		} else {
		}
	}
}

module.exports = CrudRepository;
