const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { getReviewById } = require("./controllers/reviews.controllers");

const app = express();

app.use(express.json());

//GET
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use((req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;
