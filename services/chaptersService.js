const chaptersModel = require("../models/chapersModel");

const addChapter = async (conn, courseId, chapterName, order) => {
  return await chaptersModel.createChapter(conn, courseId, chapterName, order);
};

module.exports = {
  addChapter,
};
