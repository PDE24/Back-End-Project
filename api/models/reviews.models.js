const connection = require("../../db/connection");

exports.selectReviewById = (reviewId) => {

  return connection
    .query(
      `
    SELECT * FROM reviews
    WHERE review_id = $1
    `,
      [reviewId]
    )
    .then((result) => {
        if (result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: `Review ${reviewId} does not exist`
            });
        }
      return result.rows[0];
    });
};
