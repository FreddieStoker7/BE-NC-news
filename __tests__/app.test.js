const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("GET /api/bananas", () => {
  test('404: should respond with "route not found" if the endpoint does not exist', () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("route not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Should respond with an array of topic objects each with slug and description keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topicsArr = body.topics;
        expect(topicsArr).toHaveLength(3);
        topicsArr.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/article_id", () => {
  test("200: should respond with an article object with correct keys and values", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});
describe("GET api/article/:non-existent_article_id", () => {
  test('404: should respond with "not found" if the resource does not exist (correct data type input) ', () => {
    return request(app)
      .get("/api/articles/265885")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no article found for this ID");
      });
  });
});
describe("GET api/article/:bananas", () => {
  test('400: should respond with "bad request" if the article_id param is completely the wrong data type', () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH api/articles/:article_id", () => {
  test("200 should respond with an object with the number of updated votes", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVotes).toEqual(
          expect.objectContaining({
            article_id: 2,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 2,
          })
        );
      });
  });
  test("200 should respond with an object with the number of updated votes", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVotes).toEqual({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -100,
        });
      });
  });
  test("400: malformed body passed as request - ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "dog" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("200: malformed body passed as request - empty body (should return back the current unaltered article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVotes).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  test('404: "article not found" when passed an article ID that doesnt exist', () => {
    return request(app)
      .patch("/api/articles/1190")
      .send({ inc_votes: 11 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: should respond with an array of user objects ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        expect(body.users).toEqual([
          { username: "butter_bridge" },
          { username: "icellusedkars" },
          { username: "rogersop" },
          { username: "lurker" },
        ]);
        const allUsers = body.users;
        allUsers.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return array of article objects with correct keys and in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        const theArticles = body.articles;
        theArticles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: returned array should order objects by date_created descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const theArticles = body.articles;
        console.log(theArticles)
        expect(theArticles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("In addition to what was returned previously, should also now return a new key of comment_count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const theArticle = body.article;
        expect(theArticle).toEqual(
          expect.objectContaining({
            comment_count: "2",
          })
        );
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an array of comments for the given article_id with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsArr = body.articleComments;
        expect(commentsArr).toHaveLength(11);
        commentsArr.forEach((comments) => {
          expect(comments).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("404: valid but non-existent article should return no article found", () => {
    return request(app)
      .get("/api/articles/60/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("no article found for this ID");
      });
  });
  test('404: should return "route not found" for incorrect path', () => {
    return request(app)
      .get("/api/articles/60/commentssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("route not found");
      });
  });
  test("200: Should return an empty array for a valid article that exists but has no comments attached to it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.articleComments).toEqual([]);
      });
  });
  test("400: invalid article_id returns bad request", () => {
    return request(app)
      .get("/api/articles/dragons/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles - comment count feature", () => {
  test("200: the articles array should now have a comment count for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const allArticles = body.articles;
        allArticles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(String),
            })
          );
        });
        const article3 = allArticles[0];
        expect(article3.comment_count).toBe("2");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("200: Should respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "icellusedkars", body: "yoyoyoyo" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual("yoyoyoyo");
      });
  });
  test("404: valid but non existent Id should return article not found", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({ username: "icellusedkars", body: "yoyoyoyo" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article doesnt exist");
      });
  });
  test("400: non valid Id should return bad request", () => {
    return request(app)
      .post("/api/articles/DrDre/comments")
      .send({ username: "icellusedkars", body: "yoyoyoyo" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: malformed request body should return bad request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ usernom: "icellusedkars", bod: "yoyoyoyo" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing body or username");
      });
  });
  test("400: no request body should return bad request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "icellusedkars", body: "" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe('GET /api/articles?query=', () => {
  test('200: SORT BY query sorts by a valid column ', () => {
      return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({body}) => {
        const articles = body.articles
        expect(articles).toBeSortedBy("title", {descending: true});
      })
  });
  test('400: query for non-existent column returns Invalid Sort order ', () => {
    return request(app)
    .get('/api/articles?sort_by=monkeys')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Invalid sort column')
    })
  });
  test('200: order by Asc changes the default order by of date to be ascending', () => {
    return request(app)
    .get('/api/articles?order=asc')
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      expect(articles).toBeSortedBy('created_at', {ascending: true})
    })
  });
  test('400: order by invalid order returns invalid sort order', () => {
    return request(app)
    .get('/api/articles?order=apples')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Invalid sort order')
    })
  });
  test('200: correctly sorts by a votes in ascending order (random combination)', () => {
      return request(app)
    .get('/api/articles?sort_by=votes&order=asc')
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      expect(articles).toBeSortedBy('votes', {ascending: true})
    })
  });
  test('200: only returns relevant articles when passed a topic query', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            topic: 'mitch'
           }))
      })
    })
  });
  test('404: topic does not exist', () => {
    return request(app)
    .get('/api/articles?topic=lamp')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('topic does not exist')
    })
  });
  test('200: returns correct array when given topic, order and sort_by queries', () => {
    return request(app)
    .get('/api/articles?sort_by=title&order=asc&topic=mitch')
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            topic: 'mitch'
           }))
      })
      expect(articles).toBeSortedBy('title', {ascending: true})
    })
  });
  test('200: query for topic that does exist but doesnt have any articles attached to it returns an empty array', () => {
    return request(app)
    .get('/api/articles?topic=paper')
    .expect(200)
    .then(({body}) => {
    const articles = body.articles
    expect(articles).toEqual([])
    })
  });
});