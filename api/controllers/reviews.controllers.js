const { selectReviewById } = require("../models/reviews.models");

exports.getReviewById = (req, res) => {
  const { review_id } = req.params;
  selectReviewById(review_id).then((review) => {
    res.status(200).send(review);
  });
};