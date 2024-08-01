const asyncHandler = require("express-async-handler");
const db = require("../configs/db");
const userService = require("../services/userService");
const {
  UserNotFoundError,
  InvalidCredentialsError,
} = require("../services/userService");

const getUserController = asyncHandler(async (req, res) => {
  const [data] = await db.query("SELECT * FROM `users`");

  if (!data.length) {
    return res.status(404).json({
      success: false,
      message: "No Records found",
    });
  }

  res.status(200).json({
    success: true,
    message: "All users Records",
    data,
  });
});

const registerUserController = asyncHandler(async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    await userService.registerUser(conn, username, password, email);
    await conn.commit();

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
    });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "Error in register user!!",
    });
    console.log(error);
  } finally {
    conn.release();
  }
});

const loginUserController = asyncHandler(async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password",
      });
    }

    try {
      const { user, accessToken, refreshToken } = await userService.loginUser(
        conn,
        username,
        password
      );
      await conn.commit();

      res.cookie("accessToken", accessToken, {
        // httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        data: {
          _id: user.user_id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (loginError) {
      await conn.rollback();

      if (loginError instanceof UserNotFoundError) {
        return res.status(404).json({
          success: false,
          message: loginError.message,
        });
      } else if (loginError instanceof InvalidCredentialsError) {
        return res.status(401).json({
          success: false,
          message: loginError.message,
        });
      } else {
        throw loginError;
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  } finally {
    conn.release();
  }
});

const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh Token is required",
    });
  }

  try {
    const newAccessToken = await userService.refreshUserToken(refreshToken);

    res.cookie("accessToken", newAccessToken, {
      // httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

const getUserDataByIdController = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const userData = await userService.getUserDataById(userId);
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error retrieving user data",
      });
    }
  }
});

module.exports = {
  getUserController,
  registerUserController,
  loginUserController,
  refreshTokenController,
  getUserDataByIdController,
};
