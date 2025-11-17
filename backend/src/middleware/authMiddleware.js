const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    // Expect: Authorization: Bearer <token>
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1]; // get part after "Bearer"

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    // Verify token and decode payload
    const decoded = verifyToken(token);

    // Attach decoded user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
