const connection = require("../../db/connection");

exports.selectReviewById = (reviewId) => {
  return connection
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS COMMENT_COUNT
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
    `,
      [reviewId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${reviewId} does not exist`,
        });
      }
      return result.rows[0];
    });
};

exports.updateReviewVotes = (review_id, updateBy) => {
  if (typeof updateBy !== "number" || updateBy.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Must provide a number to update votes { inc_votes: <number> }",
    });
  }

  return connection
    .query(
      `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *
  `,
      [review_id, updateBy]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ${review_id} does not exist`,
        });
      }
      return result.rows[0];
    });
};

exports.selectAllReviews = () => {
  return connection
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS COMMENT_COUNT
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC
    `
    )
    .then((result) => {
      return result.rows;
    });
};
