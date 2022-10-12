const { afterAll, beforeEach } = require("@jest/globals");
//above auto-imports but for reference I include them

const request = require("supertest");

const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/reviews", () => {
  test("Responds with an array of objects, each with correct keys and value types, sorted by date descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        body.reviews.forEach((review) => {
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
  });
  test("Also accepts category query which filters the results", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(1);
        expect(reviews[0]).toEqual(
          expect.objectContaining({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 3,
          })
        );
      });
  });
  test("Category with no linked reviews returns 0 results/empty array", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(0);
        expect(reviews).toEqual([]);
      });
  });
  test("Non existent category returns error 404", () => {
    return request(app)
      .get("/api/reviews?category=notACategory")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Category not found. Check category you are trying to access before trying again."
        );
      });
  });
  test("Invalid query column, aka not category, gets ignored and returns as if no query", () => {
    return request(app)
      .get("/api/reviews?notavalidcolumn=wrong")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        body.reviews.forEach((review) => {
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
        expect(body.msg).toBe("Bad data type. Reconsider path requirements.");
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

describe("PATCH /api/reviews/:review_id", () => {
  test("Patch request increments votes property of review and responds with now updated review object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 6 })
      .expect(200)
      .then(({ body: { updatedReview } }) => {
        expect(updatedReview).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 7,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });
  test("Patch request can also decrement the votes property too", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body: { updatedReview } }) => {
        expect(updatedReview).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: -4,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });
  test("Works correctly even if request body contains anything more than { inc_votes: Number }", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 5, should_still: "accept this now" })
      .expect(200)
      .then(({ body: { updatedReview } }) => {
        expect(updatedReview).toEqual(
          expect.objectContaining({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 6,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T10:00:20.514Z",
          })
        );
      });
  });
  test("Responds with error msg if request body does not have inc_votes key in the object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ thisisnotvalid: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request body. Reconsider requirements.");
      });
  });
  test("Responds with error msg if request body key inc_votes does not have a Number value", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "Not a number clearly" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad data type. Reconsider path requirements.");
      });
  });
  test("Non-existent review_id responds with 404 error", () => {
    return request(app)
      .patch("/api/reviews/99999")
      .expect(404)
      .send({ inc_votes: 5 })
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource cannot be found. Check ID you are trying to access before trying again."
        );
      });
  });
  test("Invalid review_id type in the path responds with 400 error", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad data type. Reconsider path requirements.");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("Responds with an array of comment objects for the given review_id of which each comment should have the following properties AND sorted by created_at", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length).toBe(3);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("Review ID with no linked comments returns 0 results/empty array", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
        expect(comments).toEqual([]);
      });
  });
  test("Non existent ID returns error 404", () => {
    return request(app)
      .get("/api/reviews/99999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource cannot be found. Check ID you are trying to access before trying again."
        );
      });
  });
  test("Invalid ID returns error 400", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad data type. Reconsider path requirements.");
      });
  });
});

describe.only("POST /api/reviews/:review_id/comments", () => {
  test("Responds 201 and with a newly created comment object with all the expected keys", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "philippaclaire9",
        body: "This is a brand new comment for review ID 3",
      })
      .expect(201)
      .then(({ body: newComment }) => {
        expect(newComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "philippaclaire9",
            body: "This is a brand new comment for review ID 3",
            review_id: 3,
          })
        );
      });
  });
  test("Non existent ID returns error 404", () => {
    return request(app)
      .post("/api/reviews/99999999/comments")
      .send({
        username: "philippaclaire9",
        body: "This is a brand new comment for review ID 3",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad post request. Reconsider provided body."
        );
      });
  });
  test("Invalid ID returns error 400", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({
        username: "philippaclaire9",
        body: "This is a brand new comment for review ID 3",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad data type. Reconsider path requirements.");
      });
  });
  test("Returns 400 when not provided the info it needs to create a new comment i.e. username and body", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        notUsername: "philippaclaire9",
        notBody: "This is a brand new comment for review ID 3",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request body. Reconsider requirements.");
      });
  });
  test("Returns 400 error when not provided the right data types for the keys it needs to create a new comment i.e. username: string and body:string", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: 1337,
        body: false,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad post request. Reconsider provided body.");
      });
  });
  test("Returns 404 error when not provided an existing username", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "ThisIsNotAnExistingUsername",
        body: "This is acceptable",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad post request. Reconsider provided body.");
      });
  });
});
