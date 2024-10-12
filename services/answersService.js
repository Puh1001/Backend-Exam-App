const db = require("../configs/db");
const answersModel = require("../models/answersModel");

const createAnswer = async (conn, questionId, content, answerLetter) => {
  const answerId = await answersModel.createAnswer(
    conn,
    questionId,
    content,
    answerLetter
  );
  return answerId;
};

const getAnswersByQuestionId = async (conn, questionId) => {
  const answers = await answersModel.getAnswersByQuestionId(conn, questionId);
  return answers;
};

const updateAnswer = async (conn, answerId, content, answerLetter) => {
  const affectedRows = await answersModel.updateAnswer(
    conn,
    answerId,
    content,
    answerLetter
  );
  return affectedRows;
};

const deleteAnswersByCourseId = async (conn, courseId) => {
  await answersModel.deleteAnswersByCourseId(conn, courseId);
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswersByCourseId,
};
