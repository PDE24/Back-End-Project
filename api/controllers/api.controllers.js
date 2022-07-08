const { readApi } = require("../models/api.models")

exports.getApi = (req, res, next) => {
  readApi()
    .then((file) => {
      res.status(200).send({ file });
    })
    .catch((err) => {
      next(err);
    });
};
