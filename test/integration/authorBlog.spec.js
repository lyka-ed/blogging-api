const request = require("supertest");
const dotenv = require("dotenv");
const { connectToMongoDB } = require("../../db");
const app = require("../../index");
const BlogSchema = require("../../models/blog.model");
const UserModel = require("../../models/user.model");
const { default: mongoose } = require("mongoose");

dotenv.config();

describe("Author Blog Route", () => {
  let token;
  let idText;

  beforeAll(async () => {
    await connectToMongoDB(process.env.MONGODB_URI);

    await UserModel.create({
      username: "gloryed",
      password: "Password",
      firstname: "Glory",
      lastname: "Edem",
      email: "glory@mail.com",
    });

    const loginResponse = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        username: "gloryed",
        password: "Password",
      });

    token = loginResponse.body.token;

    let testBlog = await BlogSchema.create({
      title: "test blog",
      description: "test blog",
      tags: ["test", "blog"],
      author: "Glory Edem",
      reading_time: 1,
      body: " Random text for testing purposes",
    });

    idText = testBlog._id.valueOf();
  }, 3600000);

  // afterEach(async () => {
  //     await conn.cleanup()
  // })

  afterAll(async () => {
    await UserModel.remove({});
    await BlogSchema.remove({});
    await mongoose.connection.close();
  }, 3600000);

  it("should create a new blog", async () => {
    // create blog in our db
    const response = await request(app)
      .post(`/authorblog?secret_token=${token}`)
      .set("content-type", "application/json")
      .send({
        title: "Twisted Love",
        description:
          "Alex Volkov is a devil blessed with the face of an angel and cursed with a past he can not escape.",
        tags: ["Alex", "Ava"],
        body: "Ava Chen is a free spirit trapped by nightmares of a childhood she can not  remember. But despite her broken past, she has never stopped seeing the beauty in the world…including the heart beneath the icy exterior of a man she shouldn app.notify want her brother  best friend. Her neighbor. Her savior and her downfall. Theirs is a love that was never supposed to happen but when it does, it unleashes secrets that could destroy them both and everything they hold dear.",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blog");
    expect(response.body.blog).toHaveProperty("author");
    expect(response.body.blog).toHaveProperty("read_count");
    expect(response.body.blog).toHaveProperty("reading_time");
  }, 3600000);

  it("should update a blog", async () => {
    // update a blog in our db
    const response = await request(app)
      .put(`/authorblog/${idText}?secret_token=${token}`)
      .set("content-type", "application/json")
      .send({
        description: "Updated Description",
        tags: ["updated", "blog"],
        state: "published",
        body: "Blog body for the updated blog.",
      });

    expect(response.status).toBe(200);
    expect(response.body.state).toEqual("published");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("read_count");
    expect(response.body).toHaveProperty("reading_time");
  }, 3600000);

  it("should update a blog", async () => {
    // update a blog in our db
    const response = await request(app)
      .patch(`/authorblog/${idText}?secret_token=${token}`)
      .set("content-type", "application/json")
      .send({
        description: "Updated Description",
        tags: ["updated", "blog"],
        state: "published",
        body: "Blog body for the  updated blog.",
      });

    expect(response.status).toBe(200);
    expect(response.body.state).toEqual("published");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("read_count");
    expect(response.body).toHaveProperty("reading_time");
  }, 3600000);

  it("should get all the author's blogs", async () => {
    // should get all the blogs created by the logged in author
    const response = await request(app)
      .get(`/authorblog?secret_token=${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("total_blogs");
    expect(response.body).toHaveProperty("blogs");
  }, 3600000);

  it("should get a particular blog from the author", async () => {
    // should get a particular blog from the author
    const response = await request(app)
      .get(`/authorblog/${idText}?secret_token=${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blogResult");
    expect(response.body).toHaveProperty("witten_by");
    expect(response.body).toHaveProperty("status");
  }, 3600000);

  it("should delete a particular blog from the author", async () => {
    // should get a particular blog from the author
    const response = await request(app)
      .delete(`/authorblog/${idText}?secret_token=${token}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
  }, 3600000);
});
