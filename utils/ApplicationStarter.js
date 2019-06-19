const env = require("./env");

class ApplicationStarter {
	init() {
		this.startupDebug = require("debug")("app:startup");
		this.express = require("express");
		this.app = this.express();
	}

	constructor(router, plugins, gembootConfigPath = null) {
		this.router = router;
		this.plugins = plugins;

		if (!gembootConfigPath) {
			gembootConfigPath = process.cwd() + "/config";
		}
		this.gembootConfigPath = gembootConfigPath;

		this.init();
	}

	start() {
		if (this.gembootConfigPath) {
			process.env.GEMBOOT_CONFIG_PATH = this.gembootConfigPath;
		}

		if (this.plugins.morgan.enable === true) {
			if (
				env("APP_ENV").toUpperCase() == "LOCAL" ||
				env("APP_DEBUG") == true
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

		this.startupDebug("APP_ENV: " + env("APP_ENV"));
		const port = env("APP_PORT");
		console.log(env("APP_NAME") + " run on localhost:" + port);

		this.app.listen(port);
	}
}

module.exports = ApplicationStarter;
