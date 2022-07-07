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

exports.insertNewReviewComment = async (commentToAdd, reviewId) => {
  if (!commentToAdd.username && !commentToAdd.body) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment object",
    });
  }

  const { username, body } = commentToAdd;

  if (isNaN(+reviewId)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid, review_id must be a number",
    });
  }

  const userCheck = await connection.query(
    `
    SELECT * FROM users
    WHERE username = $1
    `,
    [username]
  );

  if (userCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `User ${username} does not exist`,
    });
  }

  const reviewCheck = await connection.query(
    `
      SELECT * FROM reviews
      WHERE review_id = $1
      `,
    [reviewId]
  );

  if (reviewCheck.rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `Review ${reviewId} does not exist`,
    });
  }

  const insertedComment = await connection.query(
    `
    INSERT INTO comments
        (author, body, review_id)
    VALUES
        ($1, $2, $3)
    RETURNING *
    `,
    [username, body, reviewId]
  );

  return insertedComment.rows[0];
};

exports.deleteComment = async (comment_id) => {
  const deleteQuery = await connection.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *
  `,
    [comment_id]
  );

  if (deleteQuery.rowCount === 1) {
    return deleteQuery;
  }

  return Promise.reject({
    status: 404,
    msg: `Comment ${comment_id} does not exist`,
  });
};
