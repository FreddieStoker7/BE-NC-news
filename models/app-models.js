const db = require("../db/connection.js");

exports.selectTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
    return topics.rows;
};

exports.selectArticle = async (article_id) => {
const articles =  await db.query(`SELECT * FROM articles`)
return articles.rows;
}
