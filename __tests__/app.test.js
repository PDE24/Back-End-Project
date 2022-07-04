const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/categories", () => {
  test("200: returns array", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
      });
  });
  test("200: array contains objects with slug and decription keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        body.forEach((category) => {
          expect(typeof category).toBe("object");
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });

  test("404: bad request ", () => {
    return request(app)
      .get("/api/categoriez")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});
