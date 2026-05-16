const request = require("supertest");
const app = require("../index");

describe("Bot API", () => {

  test("should reject invalid phone", async () => {

    const response = await request(app)
      .post("/bot/message")
      .send({
        message: "Book doctor",
        patientPhone: "abc"
      });

    expect(response.statusCode).toBe(400);
  });

  test("should reject empty message", async () => {

    const response = await request(app)
      .post("/bot/message")
      .send({
        message: "",
        patientPhone: "9876543210"
      });

    expect(response.statusCode).toBe(400);
  });

});