class Controller {
	init() {
		this._repo = null;
	}

	constructor(Repository = null) {
		if (new.target === Controller) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		this.init();
		this.repo = new Repository();
		this[this.repo.constructor.name] = this.repo;
	}

	set repo(repo) {
		this._repo = repo;
	}

	get repo() {
		return this._repo;
	}
}

module.exports = Controller;
