const coursesModel = require("../models/coursesModel");

const addCourse = async (
  conn,
  courseName,
  description,
  author_id,
  price,
  isPublished,
  subject_id
) => {
  return await coursesModel.createCourses(
    conn,
    courseName,
    description,
    author_id,
    price,
    isPublished,
    subject_id
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
