const request = require("supertest");
const express = require("express");
const app = require("../src/server");

describe("Auth Endpoints", () => {
  it("should sign up a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "testpass",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  it("should login with correct credentials", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Login User",
        email: "loginuser@example.com",
        password: "testpass",
      });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "loginuser@example.com", password: "testpass" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "loginuser@example.com", password: "wrongpass" });
    expect(res.statusCode).toEqual(400);
  });
});
