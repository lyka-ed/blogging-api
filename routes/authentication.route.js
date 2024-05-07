const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const middleware = require("../middleware/validation");

require("dotenv").config();

const authenticationRouter = express.Router();

authenticationRouter.post(
  "/signup",
  middleware.ValidateUserSignUp,
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    logger.info("Signup successful", { user: req.user });
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

authenticationRouter.post(
  "/login",
  middleware.ValidateUserLogin,
  async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      logger.info("Login  Accessed");
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          const error = new Error("Username or password is incorrect");
          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
          };

          const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          return res.json({ token });
        });
      } catch (error) {
        logger.error(`Error in login: ${error.message}`);
        return next(error);
      }
    })(req, res, next);
  }
);

module.exports = authenticationRouter;
