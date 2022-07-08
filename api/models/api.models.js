const connection = require("../../db/connection");
const fs = require("fs/promises");

exports.readApi = () => {
  return fs
    .readFile(`${__dirname}/../../endpoints.json`, "utf-8")
    .then((file) => {
      return file;
    });
};
