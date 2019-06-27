const logErrors = (err, req, res, next) => {
	console.error(err.stack);
	next(err);
};

const clientErrorHandler = (err, req, res, next) => {
	if (req.xhr) {
		res.status(500).send({ error: "Something went wrong!" });
	} else {
		next(err);
	}
};

const errorHandler = (err, req, res, next) => {
	res.status(500);
	res.render("error", { error: err });
};

const registerErrorHandler = app => {
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);
};

module.exports = { register: registerErrorHandler };
