const express = require("express");
const {
  getCategories,
  getReviewById,
} = require("../api/controllers/categories.controllers");

const app = express();

app.use(express.json());

//GET
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use((req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;
