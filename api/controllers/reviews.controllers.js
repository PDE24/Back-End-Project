const {
  selectReviewById,
  updateReviewVotes,
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
      res.status(202).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
