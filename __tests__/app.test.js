const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe('GET /api/bananas', () => {
    test('404: should respond with "bad request" if the endpoint does not exist', () => {
        return request(app)
        .get('/api/bananas')
        .expect(404)
        .then(({body}) => {
            console.log(body)
            expect(body.msg).toEqual('Bad Request')
        })
    })
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
