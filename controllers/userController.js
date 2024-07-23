const db = require("../configs/db");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { generateRefreshToken } = require("../configs/refreshToken");
const { generateToken } = require("../configs/jwt");

const getUserController = async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM `users`");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Records found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All users Records",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in get user",
      error,
    });
  }
};

const registerUserController = async (req, res) => {
  try {
    const { user_id, username, password, email, fullname, phone, role } =
      req.body;
    if (
      !user_id ||
      !username ||
      !password ||
      !email ||
      !fullname ||
      !phone ||
      !role
    ) {
      return res.status(400).send({
        success: false,
        message: "Please Provide all fields",
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await db.query(
      "INSERT INTO `users`(`user_id`, `username`, `password`, `email`, `fullname`, `phone`, `role`) VALUES (?,?,?,?,?,?,?)",
      [user_id, username, hashedPassword, email, fullname, phone, role]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Error in INSERT QUERY",
      });
    }
    res.status(201).send({
      success: true,
      message: "New User Record Created",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in register user",
      error,
    });
  }
};

const loginUserController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both username and password",
    });
  }

  const userQuery = "SELECT * FROM `users` WHERE `username` = ?";
  const userResult = await db.query(userQuery, [username]);

  if (userResult.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const findUser = userResult[0];
  const matchPassword = findUser[0].password;
  if (!matchPassword) {
    return res.status(500).json({
      success: false,
      message: "User password not found in the database",
    });
  }

  const validPassword = await bcrypt.compare(password, matchPassword);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  // const refreshToken = generateRefreshToken(findUser.user_id);
  // const updateQuery =
  //   "UPDATE `users` SET `refreshToken` = ? WHERE `user_id` = ?";
  // await db.query(updateQuery, [refreshToken, findUser.user_id]);

  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   maxAge: 72 * 60 * 60 * 1000,
  // });

  res.status(200).json({
    success: true,
    data: {
      _id: findUser.user_id,
      username: findUser.username,
      email: findUser.email,
      fullname: findUser.fullname,
      phone: findUser.phone,
      role: findUser.role,
      token: generateToken(findUser.user_id),
    },
  });
});

module.exports = {
  getUserController,
  registerUserController,
  loginUserController,
};
