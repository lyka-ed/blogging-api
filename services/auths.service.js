const User = require("../models/user.model");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/appFeature");

// User sign up
const createUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (user) {
    throw new Error("User already exist");
  }
  const hashedPassword = await hashPassword(data.password);
  // console.log("Hashed Password:", hashedPassword); for debugging
  const newUser = new User({ ...data, password: hashedPassword });
  await newUser.save();
  return newUser;
};

// User signin
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  //generate the access token
  const token = generateToken({
    id: user._id,
    firstname: user.firstname,
  });

  return { user: user.toJSON(), token };
};

module.exports = {
  createUser,
  login,
};
