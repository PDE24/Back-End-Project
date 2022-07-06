const {
  selectCommentsByReviewId,
  insertNewReviewComment,
} = require("../models/comments.models");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewReviewComment = (req, res, next) => {
  const { commentToAdd } = req.params;

  insertNewReviewComment().then((postedComment) => {
    res.status(201).send({ postedComment });
  });
};
