const db = require("../configs/db");
const chaptersModel = require("../models/chapersModel");

const createChapter = async (conn, courseId, chapterName, order) => {
  return await chaptersModel.createChapter(conn, courseId, chapterName, order);
};

const getChaptersByCourseId = async (conn, courseId) => {
  const chapters = await chaptersModel.getChaptersByCourseId(conn, courseId);
  return chapters;
};

const updateChapter = async (conn, chapterId, chapterName, order) => {
  await chaptersModel.updateChapter(conn, chapterId, chapterName, order);
};

const deleteChaptersByCourseId = async (conn, courseId) => {
  await chaptersModel.deleteChaptersByCourseId(conn, courseId);
};

module.exports = {
  createChapter,
  getChaptersByCourseId,
  updateChapter,
  deleteChaptersByCourseId,
};
