const { selectReviewById } = require("../models/reviews.models");

exports.getReviewById = (res, req) => {
  selectReviewById().then((review) => {
    res.status(200).send(review);
  });
};
