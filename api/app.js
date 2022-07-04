const express = require("express");
const { getCategories } = require("../api/controllers/categories.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((req, res) => {
  res.status(404).send({ msg: "Invalid path" });
});

module.exports = app;
