const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCategories = () => {
  //models stuff
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    console.log(rows ,"<<<<rows")
    return rows;
  });
};
