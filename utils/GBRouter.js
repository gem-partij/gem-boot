const _forward = Symbol("forward");

class GBRouter {
	constructor(router) {
		this.router = router;
	}

	next(req, res, next) {
		next();
	}

	crud(path, middleware, controllerPath) {
		// check class to make sure the controller given to this method are extends from gemboot CrudController
		const Controller = require(controllerPath);
		if (Object.getPrototypeOf(Controller).name !== "CrudController") {
			throw new Error("Controller must extends gemboot.CrudController");
		}

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
		if (!middleware) {
			middleware = this.next;
		}
		this.router.get(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	post(path, middleware, controllerPath, methodName) {
		if (!middleware) {
			middleware = this.next;
		}
		this.router.post(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	patch(path, middleware, controllerPath, methodName) {
		if (!middleware) {
			middleware = this.next;
		}
		this.router.patch(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	delete(path, middleware, controllerPath, methodName) {
		if (!middleware) {
			middleware = this.next;
		}
		this.router.delete(path, middleware, (req, res) => {
			this[_forward](controllerPath, methodName, req, res);
		});
	}

	[_forward](controllerPath, methodName, req, res) {
		const Controller = require(controllerPath);
		new Controller()[methodName](req, res);
	}
}

module.exports = GBRouter;
