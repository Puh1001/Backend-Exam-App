db = require("../configs/db");
const answersModel = require("./answersModel");
const questionsModel = require("./questionsModel");
const lessionsModel = require("./lessionsModel");
const chapersModel = require("./chapersModel");

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

  return rows[0]; // Return the first (and should be only) result
};

const updateCourse = async (
  conn,
  id,
  courseName,
  description,
  authorId,
  price,
  thumbnail,
  subjectId,
  isPublished
) => {
  const [result] = await conn.execute(
    `UPDATE courses 
     SET course_name = ?, description = ?, author_id = ?, 
         price = ?, course_thuml = ?, subject_id = ?, is_published = ?
     WHERE course_id = ?`,
    [
      courseName,
      description,
      authorId,
      price,
      thumbnail,
      subjectId,
      isPublished,
      id,
    ]
  );
  return result.affectedRows;
};

const deleteCourseById = async (conn, courseId) => {
  await answersModel.deleteAnswersByCourseId(conn, courseId);
  await questionsModel.deleteQuestionsByCourseId(conn, courseId);
  await lessionsModel.deleteLessonsByCourseId(conn, courseId);
  await chapersModel.deleteChaptersByCourseId(conn, courseId);

  const [result] = await conn.execute(
    `DELETE FROM courses WHERE course_id = ?`,
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
