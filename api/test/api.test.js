const app = require("../app"); // Link to your server file
const supertest = require("supertest");
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const userModel = require("../models/users");
const blogModel = require("../models/blogs");

jest.setTimeout(20000);

describe("GET /", () => {
  let token;
  let author;
  let createdBlog;

  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("Connection successful");
      })
      .catch((err) => {
        console.log("Connecting to Mongoose unsuccessful");
        console.log(err);
      });

    const user = await userModel.users.create({
      firstName: "Glo",
      lastName: "Glo",
      email: "test@yahoo.com",
      password: "test",
    });

    author = user;

    const res = await supertest(app.app)
      .post("/login")
      .send({ email: "test@yahoo.com", password: "test" });
    token = res.body.token;
  });

  beforeEach(async () => {
    await mongoose
      .connect(process.env.TEST_MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("Connection successful");
      })
      .catch((err) => {
        console.log("Connecting to Mongoose unsuccessful");
        console.log(err);
      });

    const blog = await blogModel.blog.create({
      title: "test",
      body: "test",
      description: "test",
      state: "draft",
      author: author.firstName + author.lastName,
      authorID: author.id,
      tags: ["test"],
    });
    createdBlog = blog;
  });

  it("It should return all blogs", async () => {
    const res = await request(app.app).get("/blogs/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.blogs.length).toBeGreaterThan(0);
  });

  it("It should return blogs by the title filter", async () => {
    const res = await request(app.app).get("/blog/1/bytitle?title=test");
    expect(res.statusCode).toBe(200);
    expect(res.body.blog.length).toBeGreaterThan(0);
  });
  it("It should return blogs by searched author", async () => {
    const res = await request(app.app).get(
      `/blog/1/byauthor?author=${createdBlog.author}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Found Author Successfully");
  });

  it("It should return blogs by searched tags", async () => {
    const res = await request(app.app).get('/blog/1/bytag?tag=["test"]');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Found blog by tag successfully!");
  });

  it("It should return blogs by state", async () => {
    const res = await request(app.app).get("/user/blogs/filter/published");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Filter by state successful");
  });

  it("It Should get blogs by id from the database", async () => {
    const response = await supertest(app.app).get(
      `/blog/id?${createdBlog._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Found Blog!");
  });

  //Update state of blog --> draft to published
  it("Should only update blog if its the owner requesting", async () => {
    const response = await supertest(app.app)
      .put(`/${createdBlog._id}/published?secret_token=${token}`)
      .send({ state: "published" });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toStrictEqual("Successfully Updated");
  });

  it("Should only update blog if its the owner requesting", async () => {
    const response = await supertest(app.app)
      .put(`/${createdBlog._id}/published?secret_token=${token}`)
      .send({ state: "published" });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toStrictEqual("Successfully Updated");
  });

  it("Should get user's blogs", async () => {
    const response = await supertest(app.app).get(
      `/user/blogs/1?secret_token=${token}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toStrictEqual(
      "Fetched all blogs successfully!"
    );
  });
  it("Should filter blogs by read Count ", async () => {
    const res = await request(app.app).get(
      `/blogs/filter/readCount?readCount=0`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Filter by read Count successful");
  });
  it("Should filter blogs by Reading Time ", async () => {
    const res = await request(app.app).get(`/blogs/filter/readTime?readTime=0`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Filter by reading time successful");
  });

  it("Should delete a blog ", async () => {
    const res = await request(app.app).delete(
      `/delete/${createdBlog._id}?secret_token=${token}`
    );
    expect(res.statusCode).toBe(200);
  });

  afterEach(async () => {
    await blogModel.blog.deleteMany();
  });
  /* Closing database connection after each test. */
  afterAll(async () => {
    await userModel.users.deleteMany();
    await blogModel.blog.deleteMany({ title: "test" });
  });
});
