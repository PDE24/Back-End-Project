const connection = require("../../db/connection");

exports.selectCommentsByReviewId = (review_id) => {
  return connection
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1
    `,
      [review_id]
    )
    .then((result) => {
      console.log(result);

      return result.rows;
    });
};
