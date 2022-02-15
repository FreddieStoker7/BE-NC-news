const db = require("../db/connection.js");

exports.selectTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
    return topics.rows;
};

exports.selectArticle = async (article_id) => {
const articles =  await db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
//if there is a psql error this promise rejects
const anArticle = articles.rows[0]
if (!anArticle) {
    return Promise.reject({
        status: 404,
        msg: 'no article found for this ID'
    })
}
return articles.rows[0];
}
