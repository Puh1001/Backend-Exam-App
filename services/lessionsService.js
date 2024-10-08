const db = require("../configs/db");
const lessionsModel = require("../models/lessionsModel");

const addLesson = async (chapterId, type, content, order) => {
  const conn = await db.getConnection();
  try {
    const lessonId = await lessionsModel.createLesson(
      conn,
      chapterId,
      type,
      content,
      order
    );
    return lessonId;
  } finally {
    conn.release();
  }
};

const getLessonsByChapterId = async (chapterId) => {
  const conn = await db.getConnection();
  try {
    const lessons = await lessionsModel.getLessonsByChapterId(conn, chapterId);
    return lessons;
  } finally {
    conn.release();
  }
};

const updateLesson = async (lessonId, type, content, order) => {
  const conn = await db.getConnection();
  try {
    const affectedRows = await lessionsModel.updateLesson(
      conn,
      lessonId,
      type,
      content,
      order
    );
    return affectedRows;
  } finally {
    conn.release();
  }
};

const deleteLessonsByCourseId = async (courseId) => {
  const conn = await db.getConnection();
  try {
    await lessionsModel.deleteLessonsByCourseId(conn, courseId);
  } finally {
    conn.release();
  }
};

module.exports = {
  addLesson,
  getLessonsByChapterId,
  updateLesson,
  deleteLessonsByCourseId,
};
