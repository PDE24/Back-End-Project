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

describe.only("GET /api/reviews/:review_id", () => {
  test("200: returns an object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("200: has correct properties", () => {
    return request(app).get("/api/reviews/1").expect(200).then(({body}) => {
        expect(body).toHaveProperty("review_id");
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("review_body");
        expect(body).toHaveProperty("designer");
        expect(body).toHaveProperty("review_img_url");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("category");
        expect(body).toHaveProperty("owner");
        expect(body).toHaveProperty("created_at");
    })
    
  });
});
