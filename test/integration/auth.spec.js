const request = require("supertest");
const dotenv = require("dotenv");
const { connectToMongoDB } = require("../../db");
const UserModel = require("../../models/user.model");
const app = require("../../index");
const { default: mongoose } = require("mongoose");

dotenv.config();

describe("Auth: Signup", () => {
  beforeAll(async () => {
    await connectToMongoDB(process.env.MONGODB_URI);
  }, 360000);

  // afterEach(async () => {
  //     await UserModel.remove({})
  // })

  afterAll(async () => {
    await UserModel.remove({});
    await mongoose.connection.close();
  }, 360000);

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send({
        username: "gloryed",
        password: "Password",
        firstname: "Glory",
        lastname: "Edem",
        email: "glory@mail.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("username", "gloryed");
    expect(response.body.user).toHaveProperty("firstname", "Glory");
    expect(response.body.user).toHaveProperty("lastname", "Edem");
    expect(response.body.user).toHaveProperty("email", "glory@mail.com");
  }, 360000);

  it("should login a user", async () => {
    // create user in db
    // const user = await UserModel.create({ username: 'glory', password: 'asdfgh'});

    // login user
    const response = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send({
        username: "gloryed",
        password: "Password",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  }, 360000);
});
