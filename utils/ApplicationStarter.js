const env = require("./env");
const path = require("path");
const pluginMorgan = require("../plugins/morgan");
const errorHandler = require("./errorHandler");

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
			gembootConfigPath = path.join(process.cwd(), "config");
		}
		this.gembootConfigPath = gembootConfigPath;

		this.init();
	}

	start() {
		if (this.gembootConfigPath) {
			process.env.GEMBOOT_CONFIG_PATH = this.gembootConfigPath;
		}
		const logConfig = path.join(this.gembootConfigPath, "logging");

		if (this.plugins.morgan.enable === true) {
			if (
				env("APP_ENV").toUpperCase() == "LOCAL" ||
				env("APP_DEBUG") == true
			) {
				pluginMorgan.run(this.app, logConfig);
				this.startupDebug("Morgan Enabled.");
			} else {
				this.startupDebug("Morgan Disabled.");
			}
		}

		if (this.plugins["rate-limiter"].enable === true) {
			const rateLimit = require("express-rate-limit");

			// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
			// see https://expressjs.com/en/guide/behind-proxies.html
			// app.set('trust proxy', 1);

			const limiter = rateLimit(this.plugins["rate-limiter"].config);

			//  apply to all requests
			this.app.use(limiter);

			this.startupDebug("Rate Limiter Enabled.");
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

		// register error handler
		errorHandler.register(this.app, logConfig);

		this.startupDebug("APP_ENV: " + env("APP_ENV"));
		const port = env("APP_PORT");
		console.log(env("APP_NAME") + " run on localhost:" + port);

		this.app.listen(port);
	}
}

module.exports = ApplicationStarter;
