const connection = require("../../db/connection");

exports.selectReviewById = (reviewId) => {
  //console.log(reviewId)
  return connection
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1
    `,
      [reviewId]
    )
    .then((result) => {
      return result.rows[0];
    });
};
