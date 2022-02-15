const express = require("express");
const { CommandCompleteMessage } = require("pg-protocol/dist/messages");
const { getTopics, getArticle } = require("./controllers/app-controllers.js");
const {
  handle404Errors,
  handlePsqlErrors,
} = require("./error-handlers/error-handlers");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//handles psql errors 
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Bad Request" });
});

module.exports = app;
