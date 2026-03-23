const request = require("supertest");
const express = require("express");
const app = require("../src/server");

let adminToken;

describe("Movie Endpoints", () => {
  beforeAll(async () => {
    // Login as admin (assumes seeded admin user)
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "admin" }); // Replace with actual admin password hash
    adminToken = res.body.token;
  });

  it("should add a new movie (admin)", async () => {
    const res = await request(app)
      .post("/api/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Movie",
        description: "A test movie",
        poster: "poster.jpg",
        genre: "Action",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Test Movie");
  });

  it("should list movies", async () => {
    const res = await request(app).get("/api/movies");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
