const { selectTopics, selectArticle, changeVotes } = require("../models/app-models.js");


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
        res.status(200).send(updatedArticle)
})
.catch(next)

}
