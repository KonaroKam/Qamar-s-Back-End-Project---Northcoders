const db = require("../db/connection");

exports.fetchCategories = () => {
	return db.query(`SELECT * FROM categories`).then(({ rows }) => {
		return rows;
	});
};

exports.fetchCategoriesBySlug = (slugName) => {
	let queryStr = `SELECT * FROM categories`;

	if (slugName) {
		queryStr += ` WHERE slug=$1`;
	}

	return db.query(queryStr, [slugName]).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				msg: "Category not found. Check category you are trying to access before trying again.",
			});
		}
		return rows;
	});
};
