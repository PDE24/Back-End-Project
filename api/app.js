const express = require("express");
const { getCategries } = require('../api/controllers/categories.controllers')



const app = express();


app.use(express.json());

app.get('/api/categories', getCategries)

module.exports = app;
