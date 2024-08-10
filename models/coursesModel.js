db = require("../configs/db");

const createCourse = async (
  conn,
  courseName,
  author,
  price,
  thumbnail,
  subjectId
) => {
  const [result] = await conn.execute(
    "INSERT INTO courses (course_name, author, price, course_thuml, subject_id) VALUES (?, ?, ?, ?, ?)",
    [courseName, author, price, thumbnail, subjectId]
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
  author_id,
  price,
  isPublished,
  subject_id
) => {
  const [result] = await conn.execute(
    "UPDATE courses SET course_name = ?, description = ?, author_id = ? , price = ?, is_published = ?, subject_id = ?  WHERE course_id = ?",
    [courseName, description, author_id, price, isPublished, subject_id, id]
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
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
