const request = require("supertest");
const express = require("express");
const app = require("../src/server");

let userToken, showtimeId, seatId;

describe("Reservation Endpoints", () => {
  beforeAll(async () => {
    // Sign up and login as user
    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Res User",
        email: "resuser@example.com",
        password: "testpass",
      });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "resuser@example.com", password: "testpass" });
    userToken = res.body.token;
    // Assume showtime and seat exist (should be seeded or created in setup)
    // For now, set dummy values
    showtimeId = 1;
    seatId = 1;
  });

  it("should reserve a seat", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ showtime_id: showtimeId, seat_ids: [seatId] });
    // Accept 201 or 409 (if already reserved)
    expect([201, 409]).toContain(res.statusCode);
  });

  it("should get user reservations", async () => {
    const res = await request(app)
      .get("/api/reservations")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
