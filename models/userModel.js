const db = require("../configs/db");

const findUserByUsername = async (username) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM `users` WHERE `username` = ?",
      [username]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

const findUSerById = async (userId) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT u.user_id, u.username, u.email, u.fullname, u.phone, r.role_name as role
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.user_id = ?
    `,
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in getUserById model:", error);
    throw error;
  }
};

const createUser = async (conn, username, hashedPassword, email) => {
  const [userResult] = await conn.query(
    "INSERT INTO `users` (`username`, `password`, `email`, `is_active`) VALUES (?, ?, ?, TRUE)",
    [username, hashedPassword, email]
  );
  return userResult.insertId;
};

const getDefaultRole = async (conn) => {
  const [roles] = await conn.query(
    "SELECT `role_id` FROM `roles` WHERE `is_default` = TRUE LIMIT 1"
  );
  return roles[0]?.role_id;
};

const assignRoleToUser = async (conn, userId, roleId) => {
  await conn.query(
    "INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES (?, ?)",
    [userId, roleId]
  );
};

const updateUserRefreshToken = async (conn, userId, refreshToken) => {
  await conn.query(
    "UPDATE `users` SET `refresh_token` = ? WHERE `user_id` = ?",
    [refreshToken, userId]
  );
};

module.exports = {
  findUserByUsername,
  createUser,
  getDefaultRole,
  assignRoleToUser,
  updateUserRefreshToken,
  findUSerById,
};
