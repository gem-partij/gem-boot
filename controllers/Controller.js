class Controller {
	init() {
		this._repo = null;
	}

	constructor() {
		if (new.target === Controller) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		this.init();
	}

	set repo(repo) {
		this._repo = repo;
	}

	get repo() {
		return this._repo;
	}
}

module.exports = Controller;
