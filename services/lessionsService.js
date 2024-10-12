const db = require("../configs/db");
const lessionsModel = require("../models/lessionsModel");

const addLesson = async (conn, chapterId, type, content, order) => {
  return await lessionsModel.createLesson(
    conn,
    chapterId,
    type,
    content,
    order
  );
};

const updateVideoLesson = async (conn, lessonId, videoUrl) => {
  return await lessionsModel.updateVideoLesson(conn, lessonId, videoUrl);
};

const getLessonsByChapterId = async (chapterId) => {
  const lessons = await lessionsModel.getLessonsByChapterId(conn, chapterId);
  return lessons;
};

const updateLesson = async (conn, lessonId, type, content, order) => {
  const affectedRows = await lessionsModel.updateLesson(
    conn,
    lessonId,
    type,
    content,
    order
  );
  return affectedRows;
};

const deleteLessonsByCourseId = async (courseId) => {
  await lessionsModel.deleteLessonsByCourseId(conn, courseId);
};

module.exports = {
  addLesson,
  getLessonsByChapterId,
  updateVideoLesson,
  updateLesson,
  deleteLessonsByCourseId,
};
