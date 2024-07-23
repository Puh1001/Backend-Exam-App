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
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [userResult] = await conn.query(
      "INSERT INTO `users` (`username`, `password`, `email`, `is_active`) VALUES (?, ?, ?, TRUE)",
      [username, hashedPassword, email]
    );

    if (!userResult.insertId) {
      throw new Error("Failed to insert new user");
    }

    const newUserId = userResult.insertId;

    // Get default role
    const [roles] = await conn.query(
      "SELECT `role_id` FROM `roles` WHERE `is_default` = TRUE LIMIT 1"
    );

    if (roles.length === 0) {
      throw new Error("No default role found");
    }

    const defaultRoleId = roles[0].role_id;

    // Assign default role to new user
    await conn.query(
      "INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES (?, ?)",
      [newUserId, defaultRoleId]
    );

    await conn.commit();

    res.status(201).send({
      success: true,
      message: "New user registered successfully",
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error in register user:", error);
    res.status(500).send({
      success: false,
      message: "Error in registering user",
      error: error.message,
    });
  } finally {
    conn.release();
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
  const [rows] = await db.execute(userQuery, [username]);
  console.log("Number of users found:", rows);

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const findUser = userResult[1];
  console.log(userResult[1]);
  const matchPassword = findUser[0].password;
  console.log(matchPassword);
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
