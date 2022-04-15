const express = require("express");
const { getTopics, getArticle, updateVotes, getUsers, getAllArticles, getArticleIdComments, addArticleComments, deleteComment, getAllEndpoints} = require("./controllers/app-controllers.js");
const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  
});



app.get("/api", getAllEndpoints)
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateVotes); 
app.get('/api/users', getUsers);
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getArticleIdComments)
app.post('/api/articles/:article_id/comments', addArticleComments)
app.delete('/api/comments/:comment_id', deleteComment)




 //ERROR HANDLING section 

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});


app.use((err, req, res, next) => {
  if (err.code === "22P02"|| err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
if (err.code === "23503") {
  res.status(404).send({ msg: "article doesnt exist" });
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
