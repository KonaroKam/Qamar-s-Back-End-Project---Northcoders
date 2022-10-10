const { afterAll, beforeEach } = require("@jest/globals");
//above auto-imports but for reference I include them

const request = require("supertest");

const seed = require("./../db/seeds/seed");
const db = require("./../db/connection");
const testData = require("./../db/data/test-data");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Error handling Bad Paths", () => {
  test('Should respond with status 404, "bad request" for bad paths ', () => {
    return request(app)
      .get("/api/notARealPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource cannot be found. Check path you are trying to access before trying again."
        );
      });
  });
});

describe("GET /api/categories", () => {
  test("Get request to /api/categories responds with array of objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(4);
        body.forEach((obj) => {
          expect(obj).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("Get request to path responds with an object with key of review with correct keys and value types", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ review }) => {
        expect(review).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
            review_id: expect.any(Number),
            title: expect.any(String),
            category: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});
