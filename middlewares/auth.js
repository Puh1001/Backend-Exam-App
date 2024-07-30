const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const db = require("../configs/db");

const auth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // If no Bearer token, check for token in cookie
  else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get user from the token
    const [rows] = await db.execute(
      "SELECT user_id, username, email, is_active FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
});

// Optional: Middleware to check for specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
