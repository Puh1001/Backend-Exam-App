const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const auth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get user from the token
    const user = await userModel.findUSerById(decoded.id);
    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
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
