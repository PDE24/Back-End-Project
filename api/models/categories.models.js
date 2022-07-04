const connection = require("../../db/connection");

exports.selectAllCategories = () => {
  return connection.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};
