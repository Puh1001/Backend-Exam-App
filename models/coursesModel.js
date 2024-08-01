db = require("../configs/db");

const createCourses = async (
  conn,
  courseName,
  description,
  price,
  isPublished,
  subject_id,
  user_id
) => {
  const [result] = await conn.execute(
    "INSERT INTO courses (course_name, description, price, is_published, subject_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
    [courseName, description, price, isPublished, subject_id, user_id]
  );
  return result.insertId;
};

const getAllCourses = async () => {
  const [rows] = await db.execute("SELECT * FROM courses");
  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM courses WHERE course_id  = ?",
    [id]
  );
  return rows[0];
};

const updateCourse = async (
  conn,
  id,
  courseName,
  description,
  price,
  isPublished,
  subject_id,
  user_id
) => {
  const [result] = await conn.execute(
    "UPDATE courses SET course_name = ?, description = ?, price = ?, is_published = ?, subject_id = ?, user_id = ? WHERE course_id = ?",
    [courseName, description, price, isPublished, subject_id, user_id, id]
  );
  return result.affectedRows;
};

const deleteCourse = async (conn, id) => {
  const [result] = await conn.execute(
    "DELETE FROM courses WHERE course_id = ?",
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  createCourses,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
