const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
// const bcrypt = require("bcryptjs");

const userPupkin = {
  username: "vpupkin",
  password: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq", // password "1234"
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db("users").insert(userPupkin);
});

afterAll(async () => {
  await db.destroy();
});

describe("server.js", () => {
  describe("POST /api/auth/login", () => {
    // describe("if successful login", () => {
    //   it("response body has `message` and `token`", async () => {
    //     const res = await request(server)
    //       .post("/api/auth/login")
    //       .send({ username: "vpupkin", password: "1234" });
    //     expect(res.status).toBe(200);
    //     expect(res.body).toMatchObject({
    //       id: 1,
    //       username: "vpupkin",
    //       token: "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq",
    //     });
    //   });
    // });
    describe("if failed login due to `username` missing from the request body", () => {
      it("the response body should include a string exactly as follows: 'username and password required'", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ password: "1234" });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: "username and password required",
        });
      });
    });
    describe("if failed login due to `password` missing from the request body", () => {
      it("the response body should include a string exactly as follows: 'username and password required'", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ username: "vpupkin" });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: "username and password required",
        });
      });
    });
    describe("if failed login due to `username` not existing in the db", () => {
      it("the response body should include a string exactly as follows: 'invalid credentials'", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ username: "fdudkin", password: "1234" });
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({
          message: "invalid credentials",
        });
      });
    });
    describe("if failed login due to `password` being incorrect", () => {
      it("the response body should include a string exactly as follows: 'invalid credentials'", async () => {
        const res = await request(server)
          .post("/api/auth/login")
          .send({ username: "vpupkin", password: "wrong" });
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({
          message: "invalid credentials",
        });
      });
    });
  });

  // describe("POST /api/auth/register", () => {
  //   describe("if successful registration", () => {
  //     it("the response body should have `id`, `username` and `password`", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  //   describe("if failed registration due to `username` or `password` missing from the request body", () => {
  //     it("the response body should include a string exactly as follows: 'username and password required'", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  //   describe("if failed registration due to the `username` being taken", () => {
  //     it("the response body should include a string exactly as follows: 'username taken'", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  // });

  // describe("GET /api/jokes", () => {
  //   describe("if authorized", () => {
  //     it("the response is successful", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  //   describe("if missing token in the Authorization header", () => {
  //     it("the response body should include a string exactly as follows: 'token required'", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  //   describe("if invalid or expired token in the Authorization header", () => {
  //     it("the response body should include a string exactly as follows: 'token invalid'", () => {
  //       expect(true).toBe(false);
  //     });
  //   });
  // });
});
