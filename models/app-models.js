
const db = require("../db/connection.js");
const {topicChecker} = require('../db/helpers/utils.js')

exports.selectTopics = async () => {
  const topics = await db.query("SELECT * FROM topics;");
  return topics.rows;
};

exports.selectArticle = async (article_id) => {
  const articles = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
    [article_id]
  );
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
    [addVotes, article_id]
  );
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
  const getUsers = await db.query(`SELECT username FROM users;`);
  return getUsers.rows;
};

exports.selectAllArticles = async (incomingQuery) => {
const {sort_by='created_at', order='desc', topic} = incomingQuery

if (!['title', 'votes', 'author', 'topic', 'created_at'].includes(sort_by)) {
  return Promise.reject({status: 400, msg: 'Invalid sort column'})
}
if (sort_by === undefined) {
  sort_by = 'created_at'
} 
if (!['asc', 'desc'].includes(order)) {
  return Promise.reject({status: 400, msg: 'Invalid sort order'})
}
if (order === undefined) {
  order = 'desc'
}
if (topic === undefined) {
  const getArticles = await db.query(
    `SELECT articles.*, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
  );
  return getArticles.rows;

} else {
   const rows = await topicChecker(topic) 
     //console.log(rows.length)
    if (rows.length === 0) {
      console.log(rows.length)
      return Promise.reject({status: 404, msg: "topic does not exist"})
    }

  const getArticlesbyTopic = await db.query(
    `SELECT articles.*, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order} ;`, [topic]
  );
  return getArticlesbyTopic.rows
}
};

exports.selectArticleIdComments = async (article_id) => {
  const getComment = db.query(
    `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`,
    [article_id]
  );

  const isThereAnArticle = exports.selectArticle(article_id);

  const [commentsResult] = await Promise.all([getComment, isThereAnArticle]);
  const comments = commentsResult.rows;
  return comments;
};

exports.insertArticleComments = async (article_id, body, username) => {
  if (body === undefined || username === undefined) {
    return Promise.reject({status:400, msg:'missing body or username'})
  }
  if (body.length === 0) {
    return Promise.reject({status:400, msg: 'bad request'})
  }
  const insertComment = db.query(`INSERT into comments(article_id, body, author) VALUES ($1, $2, $3) RETURNING *;`, [article_id, body, username])
  
  return insertComment
}

