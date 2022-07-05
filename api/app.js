const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  handleInvalidPaths,
  handleCustomErrors,
  handle500Errors,
  handlePSQLErrors,
} = require("./controllers/error_handling.controller");
const { getReviewById, patchReviewVotes } = require("./controllers/reviews.controllers");

const app = express();

app.use(express.json());


app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

module.exports = app;
