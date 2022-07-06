const connection = require("../../db/connection");

exports.selectCommentsByReviewId = async (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid, review_id must be a number",
    });
  }

  const reviewCheck = await connection.query(
    `
  SELECT * FROM reviews
  WHERE review_id = $1
  `,
    [review_id]
  );

  if (reviewCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Review ${review_id} does not exist`,
    });
  }

  const comments = await connection.query(
    `
    SELECT * FROM comments
    WHERE review_id = $1
    `,
    [review_id]
  );

  return comments.rows;
};
