const joi = require("joi");

const ValidateUserSignUp = async (req, res, next) => {
  try {
    const schema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      username: joi.string().alphanum().min(5).max(50).required(),
      fullname: joi.string().required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            '^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{3,30}$'
          )
        ),
    });
    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(400).json({
      mesage: error.message,
      success: false,
    });
  }
};

const ValidateUserLogin = async (req, res, next) => {
  try {
    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  ValidateUserSignUp,
  ValidateUserLogin,
};
