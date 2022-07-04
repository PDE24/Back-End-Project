const { selectAllCategories } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      next(err);
    });
};
