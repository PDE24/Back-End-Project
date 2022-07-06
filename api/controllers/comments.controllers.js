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
  const commentToAdd = req.body;
  const { review_id } = req.params 
  

  insertNewReviewComment(commentToAdd, review_id)
    .then((postedComment) => {
        console.log(postedComment, "<<<<< controller");
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
