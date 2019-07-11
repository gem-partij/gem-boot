/**
 * Available validation:
 *
 * type
 * required
 * min
 * max
 * minlength
 * maxlength
 * default
 */

const validator = (() => {
	function goValidate(dataKey, dataValue, validationKey, validationValue) {
		switch (validationKey) {
			case "default":
				return dataValue ? dataValue : validationValue;
			case "required":
				return dataValue && validationValue
					? dataValue
					: new Error("Field " + dataKey + " is required!");
			case "type":
				if (dataValue) {
					return typeof dataValue === validationValue ||
						dataValue instanceof validationValue ||
						dataValue.constructor.name ===
							validationValue.prototype.constructor.name
						? dataValue
						: new Error(
								"Field " +
									dataKey +
									" type must be " +
									validationValue.prototype.constructor.name +
									", " +
									dataValue.constructor.name +
									" given."
						  );
				} else {
					return;
				}
			case "min":
				return dataValue >= validationValue
					? dataValue
					: new Error(
							"Field " +
								dataKey +
								" min value is " +
								validationValue
					  );
			case "max":
				return dataValue <= validationValue
					? dataValue
					: new Error(
							"Field " +
								dataKey +
								" max value is " +
								validationValue
					  );
			case "minlength":
				if (dataValue) {
					return dataValue && dataValue.length >= validationValue
						? dataValue
						: new Error(
								"Field " +
									dataKey +
									" min length is " +
									validationValue
						  );
				} else {
					return;
				}
			case "maxlength":
				if (dataValue) {
					return dataValue && dataValue.length <= validationValue
						? dataValue
						: new Error(
								"Field " +
									dataKey +
									" max length is " +
									validationValue
						  );
				} else {
					return;
				}
		}
	}

	function validate(data, validation = null) {
		if (validation) {
			for (const validationKey in validation) {
				let validationItem = validation[validationKey];

				if (typeof validationItem !== "object") {
					validationItem = {
						type: validationItem
					};
				}

				const dataValue = data[validationKey];

				for (const validationItemKey in validationItem) {
					try {
						const validationResponse = goValidate(
							validationKey,
							dataValue,
							validationItemKey,
							validationItem[validationItemKey]
						);
						if (validationResponse instanceof Error) {
							throw validationResponse;
						}
					} catch (err) {
						throw err;
					}
				}
			}

			// for (const dataKey in data) {
			// 	const dataValue = data[dataKey];
			// 	if (dataKey in validation) {
			// 		let validationItem = validation[dataKey];

			// 		if (typeof validationItem !== "object") {
			// 			validationItem = {
			// 				type: validationItem
			// 			};
			// 		}

			// 		for (const validationKey in validationItem) {
			// 			try {
			// 				const validationResponse = goValidate(
			// 					dataKey,
			// 					dataValue,
			// 					validationKey,
			// 					validationItem[validationKey]
			// 				);
			// 				if (validationResponse instanceof Error) {
			// 					throw validationResponse;
			// 				}
			// 			} catch (err) {
			// 				throw err;
			// 			}
			// 		}
			// 	}
			// }
		}

		return data;
	}

	return {
		validate
	};
})();

module.exports = validator;
