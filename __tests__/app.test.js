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
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Get request for review_id 1 responds with correct info", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });
  test("Non-existent review_id responds with 404 error", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource cannot be found. Check ID you are trying to access before trying again."
        );
      });
  });
  test("Invalid review_id type in the path responds with 400 error", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request. Reconsider path requirements.");
      });
  });
});

describe("GET /api/reviews/:review_id NOW NEEDS TO INCLUDE COMMENT COUNT", () => {
  test("Should now also include a key of comment_count which has a value of a number", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("Get request for review_id 2 responds with correct comment_count of 3", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 2,
            comment_count: 3,
          })
        );
      });
  });
  test("review_id 1 responds with correct comment_count of 0", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 1,
            comment_count: 0,
          })
        );
      });
  });
});

describe("GET /api/users", () => {
  test("Get request to /api/users responds with array of objects with designated keys and value types", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(4);
        body.forEach((obj) => {
          expect(obj).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
