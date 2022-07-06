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
            comment_count: "3",
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
  describe("Add comment count property", () => {
    test("200: returned review has comment count property", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toHaveProperty("comment_count");
        });
    });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("200: returns object with correct keys and values", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
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

  test("200: accepts positive number request { inc_votes : 1 }  and updates specified review votes", () => {
    const newVote = { inc_votes: 1 };

    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
      .send(newVote)
      .then(({ body: { review } }) => {
        expect(review).toHaveProperty("votes", 2);
      });
  });
  test("200: accepts negative number and decrements the vote count", () => {
    const newVote = { inc_votes: -3 };

    return request(app)
      .patch("/api/reviews/3")
      .expect(200)
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
  test("400: when not passes review_id number", () => {
    const newVote = { inc_votes: -3 };

    return request(app)
      .patch("/api/reviews/invalid_review_id")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid ID must be a number");
      });
  });
  test("400: not passed a valid update object", () => {
    const newVote = { inc_votes: "not_valid" };

    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Must provide a number to update votes { inc_votes: <number> }"
        );
      });
  });
  test("400: passed an update object with no inc_votes key", () => {
    const newVote = { ink_notes: 2 };

    return request(app)
      .patch("/api/reviews/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Must provide a number to update votes { inc_votes: <number> }"
        );
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
      });
  });
  test("200: array contains objects with username, name and avatar_url keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(typeof user).toBe("object");
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
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

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
      });
  });
  test("200: array contains the correct amount of comments", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(3);
      });
  });
  test("200: comments contain the correct properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBeGreaterThanOrEqual(1);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  test("404: review_id does not exist", () => {
    return request(app)
      .get("/api/reviews/11111/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review 11111 has no comments");
      });
  });
  test("400: review_id is not passed a number", () => {
    return request(app)
      .get("/api/reviews/not_a_number/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid, review_id must be a number");
      });
  });
});
