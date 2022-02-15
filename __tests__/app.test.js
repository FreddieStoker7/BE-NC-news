const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("GET /api/bananas", () => {
  test('404: should respond with "bad request" if the endpoint does not exist', () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
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
  test("200: should respond with and article object with correct keys and values", () => {
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
        console.log(body);
        expect(body.msg).toBe("no article found for this ID")
      });
  });
});
describe.only('GET api/article/:bananas', () => {
    test('400: should respond with "bad request" if the article_id param is completely the wrong data type', () => {
        return request(app)
        .get('/api/articles/bananas')
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("bad request")
        })
    });
});
