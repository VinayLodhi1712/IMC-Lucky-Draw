const jwt = require("jsonwebtoken");

async function checkToken(req, resp, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return resp
        .status(401)
        .json({ message: "Unauthorized: No valid token provided" });
    }

    // Extract token by removing "Bearer "
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET);

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return resp.status(401).json({ message: "Login session expired" });
  }
}

module.exports = checkToken;
