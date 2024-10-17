const express = require("express");
const {
  getUser,
  registerUser,
  loginUser,
  getUserDataById,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const router = express.Router();
// test
router.get("/getUsers", getUser);

// Register
router.post("/registerUser", registerUser);

// Login
router.post("/login", loginUser);

// get user by id
router.get("/getUserData/:id", auth, getUserDataById);

//  Refesh Token 
router.post("/refresh-token", registerUser);

module.exports = router;
