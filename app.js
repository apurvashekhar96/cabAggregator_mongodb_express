const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const routes = require("./routes/routes");

const app = express();

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost/taxiAggregator");
}

app.use(bodyParser.json());

routes(app);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(422).send({ error: err._message });
});

module.exports = app;
