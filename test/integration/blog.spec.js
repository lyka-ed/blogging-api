const request = require("supertest");
const dotenv = require("dotenv");
const { connectToMongoDB } = require("../../dbConnect");
const app = require("../../index");
const BlogSchema = require("../../models/blog.model");
const { default: mongoose } = require("mongoose");

dotenv.config();

describe("Testing the Blog Route for logged-in and and not logged-in users", () => {
  let idText;

  beforeAll(async () => {
    await connectToMongoDB(process.env.MONGODB_URI);

    let testBlog = await BlogSchema.create({
      title: "testing blog",
      description: "test blog",
      tags: ["test", "blog"],
      author: "Glory Edem",
      state: "published",
      reading_time: 1,
      body: " Random text for primarily for testing purposes",
    });

    idText = testBlog._id.valueOf();
  }, 360000);

  // afterEach(async () => {
  //     await conn.cleanup()
  // })

  afterAll(async () => {
    await BlogSchema.remove({});
    await mongoose.connection.close();
  }, 360000);

  it("testing the /blog route", async () => {
    // will return all the published blogs and their details
    const response = await request(app)
      .get("/blog")
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total_blogs");
    expect(response.body).toHaveProperty("blogs");
  }, 360000);

  it("testing the /blog route with an id", async () => {
    // will return the specific published blog and its details
    const response = await request(app)
      .get(`/blog/${idText}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogResult");
    expect(response.body).toHaveProperty("witten_by");
    expect(response.body).toHaveProperty("status");
  }, 360000);
});
