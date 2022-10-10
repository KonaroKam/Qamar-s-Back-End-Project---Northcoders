const { fetchCategories } = require("../models/categories_models");

exports.getCategories = (req, res, next) => {
  //stuff
  fetchCategories()
    .then((categories) => {
      // console.log(categories, "categories");
      res.status(200).send(categories);
    })
    .catch((err) => {
      next(err);
    });
};
