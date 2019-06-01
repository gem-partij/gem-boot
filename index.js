"use strict";

module.exports = {
	// Controllers
	Controller: require("./controllers/Controller"),
	CrudController: require("./controllers/CrudController"),

	// Models
	Model: require("./models/Model"),

	// Repositories
	Repository: require("./repositories/Repository"),
	CrudRepository: require("./repositories/CrudRepository"),

	// Utils
	database: require("./utils/database"),
	GBRouter: require("./utils/GBRouter"),

	// config
	knexfile: require("./knexfile")
};
