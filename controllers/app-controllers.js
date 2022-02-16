const app = require("../app.js");
const { selectTopics, selectArticle, changeVotes, selectUsers, selectAllArticles} = require("../models/app-models.js");


exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  })
  .catch(next);
};

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    selectArticle(article_id).then((article) => {
        res.status(200).send({article: article})
    })
    .catch(next)
}

exports.updateVotes = (req, res, next) => {
    const {article_id} = req.params
    const addVotes= req.body.inc_votes 
changeVotes(article_id, addVotes).then((updatedArticle) => {
        res.status(200).send({updatedVotes: updatedArticle})
})
.catch(next)
}


exports.getUsers = (req, res, next) => {
    selectUsers().then((users)=> {
    res.status(200).send({users: users})
}).catch(next)
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        console.log(articles)
        res.status(200).send({articles: articles})
    }).catch(next)
}
