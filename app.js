const express = require("express");
const { getTopics, getArticle, updateVotes } = require("./controllers/app-controllers.js");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateVotes); 







//
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
  res.status(500).send({ msg: "internal server error" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "route not found" });
});

module.exports = app;
