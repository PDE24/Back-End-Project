const connection = require("../../db/connection");

exports.selectCommentsByReviewId = (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid, review_id must be a number",
    });
  }

  return connection
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1
    `,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} has no comments`,
        });
      }
      return result.rows;
    });
};
