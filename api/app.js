const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const {
  handleInvalidPaths,
  handleCustomErrors,
  handle500Errors,
  handlePSQLErrors,
} = require("./controllers/error_handling.controller");

const { getUsers } = require("./controllers/users.controller");

const {
  getReviewById,
  patchReviewVotes,
  getAllReviews,
} = require("./controllers/reviews.controllers");

const {
  getCommentsByReviewId,
  postNewReviewComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.post("/api/reviews/:review_id/comments", postNewReviewComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors);

module.exports = app;
