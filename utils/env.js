require("dotenv").config();

module.exports = (key, default_value = "") => {
	return process.env[key] ? process.env[key] : default_value;
};
