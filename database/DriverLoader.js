const availableDrivers = {
	mysql: "Sequelize",
	pgsql: "Sequelize",
	mongodb: "Mongoose"
};

const load = driverName => {
	const d = availableDrivers[driverName];
	if (d) {
		return require("./drivers/" + d);
	}
	throw new Error("Driver " + driverName + " Not Found!");
};

module.exports = {
	load
};
