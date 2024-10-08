const db = require("../configs/db");
const answersModel = require("../models/answersModel");

const createAnswer = async (questionId, content, answerLetter) => {
  const conn = await db.getConnection();
  try {
    const answerId = await answersModel.createAnswer(
      conn,
      questionId,
      content,
      answerLetter
    );
    return answerId;
  } finally {
    conn.release();
  }
};

const getAnswersByQuestionId = async (questionId) => {
  const conn = await db.getConnection();
  try {
    const answers = await answersModel.getAnswersByQuestionId(conn, questionId);
    return answers;
  } finally {
    conn.release();
  }
};

const updateAnswer = async (answerId, content, answerLetter) => {
  const conn = await db.getConnection();
  try {
    const affectedRows = await answersModel.updateAnswer(
      conn,
      answerId,
      content,
      answerLetter
    );
    return affectedRows;
  } finally {
    conn.release();
  }
};

const deleteAnswersByCourseId = async (courseId) => {
  const conn = await db.getConnection();
  try {
    await answersModel.deleteAnswersByCourseId(conn, courseId);
  } finally {
    conn.release();
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswersByCourseId,
};
