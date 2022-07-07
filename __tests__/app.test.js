const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Bad Path", () => {
  test("404: handles any bad paths", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Request");
      });
  });
});

describe("GET", () => {
  describe("/api/categories", () => {
    test("200: returns array containing objects with slug and decription keys", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toBeInstanceOf(Array);
          expect(categories.length).toBeGreaterThanOrEqual(1);
          categories.forEach((category) => {
            expect(typeof category).toBe("object");
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });

  describe("/api/reviews/:review_id", () => {
    test("200: returns object with correct keys", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
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
              comment_count: 3,
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

  describe("/api/users", () => {
    test("200: returns array containing objects with username, name and avatar_url keys", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeInstanceOf(Array);
          expect(users.length).toBeGreaterThanOrEqual(1);
          users.forEach((user) => {
            expect(typeof user).toBe("object");
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });

  describe("/api/reviews/:review_id/comments", () => {
    test("200: returns array with correct amount of comments containing the correct properties", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(3);
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("review_id", 2);
          });
        });
    });
    test("200: review has no comments returns empty array", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
          expect(comments).toBeInstanceOf(Array);
        });
    });
    test("404: review_id does not exist", () => {
      return request(app)
        .get("/api/reviews/11111/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Review 11111 does not exist");
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

  describe("/api/reviews", () => {
    test("200: returns reviews with the correct properties and length", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBe(13);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach((review) => {
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
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: reviews are sorted by created_at in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBeGreaterThanOrEqual(1);
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("PATCH", () => {
  describe("/api/reviews/:review_id", () => {
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
});

describe("POST", () => {
  describe("/api/reviews/:review_id/comments", () => {
    test("201: new comment posted", () => {
      const newComment = {
        username: "mallionaire",
        body: "I loved this game!",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { postedComment } }) => {
          expect(postedComment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: newComment.body,
              review_id: 1,
              author: newComment.username,
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("404: passed an invalid review_id", () => {
      const newComment = {
        username: "mallionaire",
        body: "I loved this game!",
      };

      return request(app)
        .post("/api/reviews/99999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Review 99999 does not exist");
        });
    });
    test("400: review_id is not passed a number", () => {
      const newComment = {
        username: "mallionaire",
        body: "I loved this game!",
      };

      return request(app)
        .post("/api/reviews/not_a_number/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid, review_id must be a number");
        });
    });
    test("404: Username does not exist", () => {
      const newComment = {
        username: "not_a_user",
        body: "I loved this game!",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User not_a_user does not exist");
        });
    });
    test("400: new comment doesn't have username or body key", () => {
      const newComment = {
        something1: "mallionaire",
        something2: "I loved this game!",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid comment object");
        });
    });
  });
});

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    test.only("204: delete the given comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test.only("404: comment does not exist", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment 99999 does not exist");
        });
    });
    test.only("400: when passes not a number as comment_id", () => {
      return request(app)
        .delete("/api/comments/not_a_number")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid ID must be a number");
        });
    });
  });
});
