const express = require("express");
const app = express();

app.use(express.json());

app.get('/api/categories', getCategries)

module.exports = app;
