const db = require("../configs/db");

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
  const [rows] = await db.execute(`
    SELECT c.*, s.subject_name 
    FROM courses c
    LEFT JOIN subjects s ON c.subject_id = s.subject_id
    ORDER BY c.course_id DESC
  `);
  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT c.*, s.subject_name 
    FROM courses c
    LEFT JOIN subjects s ON c.subject_id = s.subject_id
    WHERE c.course_id = ?
  `,
    [id]
  );
  return rows[0];
};

const updateCourse = async (
  conn,
  id,
  courseName,
  author,
  price,
  thumbnail,
  subjectId
) => {
  const [result] = await conn.execute(
    "UPDATE courses SET course_name = ?, author = ?, price = ?, course_thuml = ?, subject_id = ? WHERE course_id = ?",
    [courseName, author, price, thumbnail, subjectId, id]
  );
  return result.affectedRows;
};

const deleteCourseById = async (conn, courseId) => {
  const [result] = await conn.execute(
    "DELETE FROM courses WHERE course_id = ?",
    [courseId]
  );
  return result.affectedRows;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourseById,
};
