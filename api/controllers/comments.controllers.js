const {
  selectCommentsByReviewId,
  insertNewReviewComment,
  deleteComment,
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
  const commentToAdd = req.body;
  const { review_id } = req.params;

  insertNewReviewComment(commentToAdd, review_id)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  console.log(comment_id);

  deleteComment()
    .then(() => {
      res.status(201);
    })
    .catch((err) => {
      next(err);
    });
};
