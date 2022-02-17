const db = require("../db/connection.js");

exports.selectTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
  return topics.rows;
};

exports.selectArticle = async (article_id) => {
  const articles = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
    [article_id]
  );
  console.log(articles)
  //if there is a psql error this promise rejects
  const anArticle = articles.rows[0];
  if (!anArticle) {
    return Promise.reject({
      status: 404,
      msg: "no article found for this ID",
    });
  }
  return articles.rows[0];
};

exports.changeVotes = async (article_id, addVotes = 0) => {
  const updatedArticleVotes = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [addVotes, article_id]);
  const anArticle = updatedArticleVotes.rows[0];
  if (!anArticle) {
    return Promise.reject({
      status: 404,
      msg: "article not found",
    });
  }
  return updatedArticleVotes.rows[0];
};

exports.selectUsers = async () => {
    const getUsers = await db.query(`SELECT username FROM users`)
    return getUsers.rows
}

exports.selectAllArticles = async () => {
    const getArticles = await db.query(`SELECT author, title, article_id, topic, created_at, votes FROM articles ORDER BY created_at DESC`)
    return getArticles.rows
}

// exports.selectArticleIdComments = async () => {
//     const 
// }
