const request = require("supertest");
const express = require("express");
const app = require("../src/server");

let adminToken;

describe("Admin Endpoints", () => {
  beforeAll(async () => {
    // Login as admin (assumes seeded admin user)
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "admin" }); // Replace with actual admin password
    adminToken = res.body.token;
  });

  it("should get reservation stats", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get revenue", async () => {
    const res = await request(app)
      .get("/api/admin/revenue")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should list all reservations", async () => {
    const res = await request(app)
      .get("/api/admin/reservations")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
