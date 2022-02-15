const { selectTopics, selectArticle } = require("../models/app-models.js");

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
