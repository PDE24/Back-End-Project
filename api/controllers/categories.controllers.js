const { selectAllCategories } = require("../models/categories.models");

exports.getCategories = (req, res) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send({categories});
    })
    .catch((err) => {
      next(err);
    });
};
