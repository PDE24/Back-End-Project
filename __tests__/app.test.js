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

describe("GET /api/reviews/:review_id", () => {
  test("200: returns an object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("200: has correct keys on the objects", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("created_at");
      });
  });
  test("200: property values are correct", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          review: {
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          },
        });
      });
  });
  test("404: review does not exist", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review 99999 does not exist");
      });
  });
  test("400: when passed not a number", () => {
    return request(app)
      .get("/api/reviews/not_a_number")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid ID must be a number");
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("202: returns object with correct keys and values", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/1")
      .expect(202)
      .send(newVote)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test("202: accepts positive number request { inc_votes : 1 }  and updates specified review votes", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/1")
      .expect(202)
      .send(newVote)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("votes", 2);
      });
  });
  test("202: accepts negative number and decrements the vote count", () => {
    const newVote = { inc_votes: -3 };

    return request(app)
      .patch("/api/reviews/3")
      .expect(202)
      .send(newVote)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("votes", 2);
      });
  });
  test("404: review id does not exist", () => {
    const newVote = { inc_votes: -3 };

    return request(app)
      .patch("/api/reviews/99999")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review 99999 does not exist");
      });
  });
});
