require("dotenv").config();

class ApplicationStarter {
	init() {
		this.startupDebug = require("debug")("app:startup");
		this.express = require("express");
		this.app = this.express();
	}

	constructor(router, plugins) {
		this.router = router;
		this.plugins = plugins;
		this.init();
	}

	start() {
		if (this.plugins.morgan.enable === true) {
			if (
				process.env.APP_ENV == "local" ||
				process.env.APP_DEBUG == true
			) {
				const morgan = require("morgan");
				this.app.use(morgan("tiny"));
				this.startupDebug("Morgan Enabled.");
			} else {
				this.startupDebug("Morgan Disabled.");
			}
		}

		if (this.plugins.helmet.enable === true) {
			const helmet = require("helmet");
			this.app.use(helmet());
			this.startupDebug("Helmet Enabled.");
		}

		if (this.plugins.compression.enable === true) {
			const compression = require("compression");
			this.app.use(compression());
			this.startupDebug("Compression Enabled.");
		}

		if (this.plugins["body-parser"].enable === true) {
			const bodyParser = require("body-parser");
			this.app.use(bodyParser.json());
			this.app.use(bodyParser.urlencoded({ extended: true }));
			this.startupDebug("BodyParser Enabled.");
		}

		this.app.use(this.router);
		this.startupDebug("Router Registered.");

		this.startupDebug("APP_ENV: " + process.env.APP_ENV);
		const port = process.env.APP_PORT;
		console.log(process.env.APP_NAME + " run on localhost:" + port);

		this.app.listen(port);
	}
}

module.exports = ApplicationStarter;
