const {
  selectReviewById,
  updateReviewVotes,
  selectAllReviews,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const updateBy = req.body.inc_votes;

  updateReviewVotes(review_id, updateBy)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  const { order, sort_by, category } = req.query;
  
  selectAllReviews(order, sort_by, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
