const jwt = require("jsonwebtoken");

// RECOMMENDED: Use JWT_SECRET variable everywhere (set in .env)
const JWT_SECRET = process.env.JWT_SECRET || "my-secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Token required",
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }
    req.user = decoded; // { userId, role, email, ... }
    next();
  });
}

module.exports = authMiddleware;
