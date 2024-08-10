const coursesModel = require("../models/coursesModel");

const getSubjectIdByName = async (conn, name) => {
  const [rows] = await conn.execute(
    "SELECT subject_id FROM subjects WHERE subject_name = ?",
    [name]
  );
  return rows[0] ? rows[0].subject_id : null;
};

const addCourse = async (
  conn,
  courseName,
  author,
  price,
  thumbnail,
  subject
) => {
  // const authorId = await getUserIdByName(conn, author);
  const subjectId = await getSubjectIdByName(conn, subject);

  return await coursesModel.createCourse(
    conn,
    courseName,
    author,
    price,
    thumbnail,
    subjectId
  );
};

const getAllCourses = async () => {
  return await coursesModel.getAllCourses();
};

const getCourseById = async (id) => {
  return await coursesModel.getCourseById(id);
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
  return await coursesModel.updateCourse(
    conn,
    id,
    courseName,
    description,
    author_id,
    price,
    isPublished,
    subject_id
  );
};

const deleteCourse = async (conn, id) => {
  return await coursesModel.deleteCourse(conn, id);
};

module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
