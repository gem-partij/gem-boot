const _forward = Symbol("forward");

class GBRouter {
	constructor(router) {
		this.router = router;
	}

	crud(path, middleware, controllerPath) {
		// GET /
		this.get(path + "/", middleware, controllerPath, "index");

		// GET /:id
		this.get(path + "/:id", middleware, controllerPath, "show");

		// POST /
		this.post(path + "/", middleware, controllerPath, "store");

		// PATCH /:id
		this.patch(path + "/:id", middleware, controllerPath, "update");

		// DELETE /:id
		this.delete(path + "/:id", middleware, controllerPath, "destroy");
	}

	get(path, middleware, controllerPath, methodName) {
		this.router.get(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	post(path, middleware, controllerPath, methodName) {
		this.router.post(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	patch(path, middleware, controllerPath, methodName) {
		this.router.patch(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	delete(path, middleware, controllerPath, methodName) {
		this.router.delete(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	[_forward](controllerPath, methodName, req, res) {
		const Controller = require(controllerPath);

		if (Object.getPrototypeOf(Controller).name !== "CrudController") {
			throw new Error("Controller must extends gemboot.CrudController");
		}

		new Controller()[methodName](req, res);
	}
}

module.exports = GBRouter;
