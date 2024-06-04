const express = require("express");
const { wrapper } = require("../utils/appFeature.js");
const authController = require("../controllers/authentication.controller.js");

const authRoute = express.Router();

authRoute.post("/signup", wrapper(authController.signUp));
authRoute.post("/login", wrapper(authController.login));

module.exports = authRoute;
