const authService = require("../services/auths.service.js");
const { loginSchema, signupSchema } = require("../middleware/validation.js");
const { validate } = require("../utils/appFeature.js");

const signUp = async (req, res) => {
  // console.log("Lyka bby", req.body);

  validate(signupSchema, req.body);

  const user = await authService.createUser(req.body);
  if (user) {
    res
      .status(201)
      .json({ sucess: true, message: "User Created Successfully", data: user });
  }
};

const login = async (req, res) => {
  validate(loginSchema, req.body);
  const { email, password } = req.body;
  const userData = await authService.login(email, password);
  if (userData) {
    res.status(200).json({
      success: true,
      message: "User logged-in successfully",
      data: userData,
    });
  }
};

module.exports = { signUp, login };
