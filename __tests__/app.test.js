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
  test("200: should respond with and article object with correct keys and values", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        })
});
})

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
describe('GET api/article/:bananas', () => {
    test('400: should respond with "bad request" if the article_id param is completely the wrong data type', () => {
        return request(app)
        .get('/api/articles/bananas')
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("bad request")
        })
    });
});

describe.only('PATCH api/articles/:article_id', () => {
    test('200 should respond with an object with the number of updated votes', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 2 })
        .expect(200) 
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: expect.any(String),
                votes: 2,
              })
        })
    });
    test('200 should respond with an object with the number of updated votes', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: -100 })
        .expect(200) 
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: expect.any(String),
                votes: -100,
              })
        })
    });
    test('400: malformed body passed as request - ', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: "dog"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual("bad request")
        })
    });
    test('200: malformed body passed as request - empty body (should return back the current unaltered article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 100,
              })
        })
    });
    test('404: "article not found" when passed an article ID that doesnt exist', () => {
        return request(app)
        .patch('/api/articles/1190')
        .send({inc_votes: 11})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('article not found')
        })

    });

})
