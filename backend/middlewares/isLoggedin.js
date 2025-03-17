const jwt = require("jsonwebtoken");

async function checkToken(req, resp, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return resp
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    return resp.status(401).json({ message: "Login seesion expired" });
  }
}

module.exports = checkToken;
