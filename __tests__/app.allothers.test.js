const { afterAll, beforeEach } = require("@jest/globals");
//above auto-imports but for reference I include them

const request = require("supertest");

const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api for guide of api paths", () => {
	test("Should respond with an object with title endpoints_guide that includes info on all available endpoints", () => {
		const { endpoints_file } = require("../endpoints.json");
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoint_guide } }) => {
				expect(endpoint_guide).toEqual(endpoints_file);
			});
	});
});

describe("Error handling Bad Paths", () => {
	test('Should respond with status 404, "bad request" for bad paths ', () => {
		return request(app)
			.get("/api/notARealPath")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Path cannot be found. Check path you are trying to access before trying again."
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

describe("DELETE /api/comments/:comment_id", () => {
	test("DELETE request to valid ID responds with 204", () => {
		return request(app).delete("/api/comments/1").expect(204);
	});
	test("should return 404 if a non-existent ID to delete", () => {
		return request(app)
			.delete(`/api/comments/1084239843`)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe(
					"ID not found. RE-submit request with a valid ID"
				);
			});
	});
	test("should return 400 if an invalid ID to delete", () => {
		return request(app)
			.delete(`/api/comments/bananas`)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe(
					"Bad data type. Reconsider path requirements."
				);
			});
	});
});
