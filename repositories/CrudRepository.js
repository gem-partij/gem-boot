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

		if (this.model) {
			this.PK = this.model.primaryKey;
		}
	}

	getAll(options = null) {
		if (this.isRelational) {
			if (options === null) {
				options = {
					limit: 30,
					offset: 0,
					order: [[this.PK, "DESC"]],
					attributes: this.model.unprotectedAttributes
				};
			}
			return this.query.findAll(options);
		} else {
			if (options === null) {
				options = {
					limit: 30,
					sort: { [this.PK]: -1 }
				};
			}
			return this.query.find({}, null, options).exec();
		}
	}

	getOne(id) {
		if (this.isRelational) {
			return this.query.findByPk(id, {
				attributes: this.model.unprotectedAttributes
			});
		} else {
			return this.query.findById(id).exec();
		}
	}

	insert(data) {
		return this.query.create(data);
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
			return this.query.findOneAndUpdate({ [this.PK]: id }, data).exec();
		}
	}

	delete(id) {
		if (this.isRelational) {
			// const pk = this.model.primaryKey;
			return this.query.destroy({
				where: {
					[this.PK]: id
				}
			});
		} else {
			return this.query
				.findById(id)
				.remove()
				.exec();
		}
	}
}

module.exports = CrudRepository;
