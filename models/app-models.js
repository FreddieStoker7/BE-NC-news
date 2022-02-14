const db = require("../db/connection.js");

exports.selectTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
    return topics.rows;
};

exports.selectArticle = async (article_id) => {
const articles =  await db.query(`SELECT * FROM articles WHERE article_id = $1`)
return articles.rows;
}
