const db = require("../configs/db");
const chaptersModel = require("../models/chapersModel");

const createChapter = async (courseId, chapterName, order) => {
  const conn = await db.getConnection();
  try {
    const chapterId = await chaptersModel.createChapter(
      conn,
      courseId,
      chapterName,
      order
    );
    return chapterId;
  } finally {
    conn.release();
  }
};

const getChaptersByCourseId = async (courseId) => {
  const conn = await db.getConnection();
  try {
    const chapters = await chaptersModel.getChaptersByCourseId(conn, courseId);
    return chapters;
  } finally {
    conn.release();
  }
};

const updateChapter = async (chapterId, chapterName, order) => {
  const conn = await db.getConnection();
  try {
    await chaptersModel.updateChapter(conn, chapterId, chapterName, order);
  } finally {
    conn.release();
  }
};

const deleteChaptersByCourseId = async (courseId) => {
  const conn = await db.getConnection();
  try {
    await chaptersModel.deleteChaptersByCourseId(conn, courseId);
  } finally {
    conn.release();
  }
};

module.exports = {
  createChapter,
  getChaptersByCourseId,
  updateChapter,
  deleteChaptersByCourseId,
};
