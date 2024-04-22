const request = require("supertest");
const app = require("../../index");

describe("Home Route", () => {
  it("testing the home route", async () => {
    const response = await request(app)
      .get("/")
      .set("content-type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual(true);
    expect(response.body.i).toEqual("Key information about this API.");
    expect(response.body.ii).toEqual("use /blog to view all published blogs");
    expect(response.body.iii).toEqual(
      "Login or signup (using /login or /signup) to be able create and manage your blog as an author on /authorblog route."
    );
  });
});
