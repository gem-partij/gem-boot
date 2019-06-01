class GBRouter {
	constructor(router) {
		this.router = router;
	}

	crud(path, middleware, controllerPath) {
		const Controller = require(controllerPath);

		if (Object.getPrototypeOf(Controller).name !== "CrudController") {
			throw new Error("Controller must extends gemboot.CrudController");
		}

		// GET /
		this.router.get(path + "/", middleware, (req, res) => {
			new Controller().index(req, res);
		});

		// GET /:id
		this.router.get(path + "/:id", middleware, (req, res) => {
			new Controller().show(req, res);
		});

		// POST /
		this.router.post(path + "/", middleware, (req, res) => {
			new Controller().store(req, res);
		});

		// PATCH /:id
		this.router.patch(path + "/:id", middleware, (req, res) => {
			new Controller().update(req, res);
		});

		// DELETE /:id
		this.router.delete(path + "/:id", middleware, (req, res) => {
			new Controller().destroy(req, res);
		});
	}
}

module.exports = GBRouter;
