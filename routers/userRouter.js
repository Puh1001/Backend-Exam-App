const express = require("express");
const {
  getUserController,
  registerUserController,
  loginUserController,
  getUserDataByIdController,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const router = express.Router();
// test
router.get("/getUsers", getUserController);

// Register
router.post("/registerUser", registerUserController);

// Login
router.post("/login", loginUserController);

// get user by id
router.get("/getUserData/:id", auth, getUserDataByIdController);

//  Refesh Token Controller
router.post("/refresh-token", registerUserController);

module.exports = router;
