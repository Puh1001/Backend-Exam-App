const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwt");
const {
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/refreshToken");
const userModel = require("../models/userModel");

const registerUser = async (conn, username, password, email) => {
  const hashedPassword = await hashPassword(password);
  const newUserId = await userModel.createUser(
    conn,
    username,
    hashedPassword,
    email
  );
  const defaultRoleId = await userModel.getDefaultRole(conn);

  if (!defaultRoleId) {
    throw new Error("No default role found");
  }

  await userModel.assignRoleToUser(conn, newUserId, defaultRoleId);
};

class UserNotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

const loginUser = async (conn, username, password) => {
  const user = await userModel.findUserByUsername(username);

  if (!user) {
    throw new UserNotFoundError();
  }

  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw new InvalidCredentialsError();
  }

  const accessToken = generateToken(user.user_id);
  const refreshToken = generateRefreshToken(user.user_id);

  await userModel.updateUserRefreshToken(conn, user.user_id, refreshToken);

  return { user, accessToken, refreshToken };
};

const refreshUserToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await userModel.findUserByUsername(decoded.id);

  if (!user || user.refresh_token !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateToken(user.user_id);
  return newAccessToken;
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  UserNotFoundError,
  InvalidCredentialsError,
};
