const { verifyToken } = require("../utils/appFeature");

const isAuthenticated = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) throw new Error("No authorization header found");
  try {
    const token = authorization.split(" ")[1];
    const decode = verifyToken(token);
    if (!req.user) req.user = {}; //set a user object to empty object if it doesn't exist
    req.user.id = decode.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token provided." });
  }
};

module.exports = {
  isAuthenticated,
};
