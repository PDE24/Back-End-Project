const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returns array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
      });
  });
  test("200: array contains objects with slug and decription keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        categories.forEach((category) => {
          expect(typeof category).toBe("object");
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
  test("404: handles bad paths", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Request");
      });
  });
});


