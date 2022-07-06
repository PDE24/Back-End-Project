const { selectCommentsByReviewId } = require("../models/comments.models");

exports.getCommentsByReviewId = (req, res, next) => {
  selectCommentsByReviewId()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
