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

module.exports = {
  addLesson,
  updateVideoLesson,
};
