const db = require('../db/connection.js');
const data = require('../db/data/test-data');
const request = require("supertest");
const app = require('../app.js')
const seed = require("../db/seeds/seed.js");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe('GET /api/topics', () => {
    test('200: Should respond with an array of topic objects each with slug and description keys', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body:{topics}}) => {
        console.log(topics)

        })
    });
});
