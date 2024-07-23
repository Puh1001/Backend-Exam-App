const express = require("express");
const {
  getUserController,
  registerUserController,
  loginUserController,
} = require("../controllers/userController");

const router = express.Router();
// test
router.get("/getUsers", getUserController);

// Register
router.post("/registerUser", registerUserController);

// Login
router.post("/login", loginUserController);

module.exports = router;
