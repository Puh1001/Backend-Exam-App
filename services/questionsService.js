const db = require("../configs/db");
const questionsModel = require("../models/questionsModel");
const answersModel = require("../models/answersModel");

const addQuizQuestion = async (
  conn,
  lessonId,
  content,
  options,
  correctAnswer
) => {
  const questionId = await questionsModel.createQuestion(
    conn,
    lessonId,
    content,
    correctAnswer
  );

  for (let i = 0; i < options.length; i++) {
    await answersModel.createAnswer(
      conn,
      questionId,
      options[i],
      String.fromCharCode(65 + i)
    );
  }

  return questionId;
};

const createQuestion = async (conn, lessonId, content, correctAnswer) => {
  const questionId = await questionsModel.createQuestion(
    conn,
    lessonId,
    content,
    correctAnswer
  );
  return questionId;
};

const getQuestionsByLessonId = async (conn, lessonId) => {
  const questions = await questionsModel.getQuestionsByLessonId(conn, lessonId);
  return questions;
};

const updateQuestion = async (conn, questionId, content, correctAnswer) => {
  const affectedRows = await questionsModel.updateQuestion(
    conn,
    questionId,
    content,
    correctAnswer
  );
  return affectedRows;
};

const updateQuizQuestion = async (
  conn,
  questionId,
  content,
  options,
  correctAnswer
) => {
  await questionsModel.updateQuestion(conn, questionId, content, correctAnswer);

  return questionId;
};

const deleteQuestionsByCourseId = async (conn, courseId) => {
  await questionsModel.deleteQuestionsByCourseId(conn, courseId);
};

module.exports = {
  addQuizQuestion,
  createQuestion,
  getQuestionsByLessonId,
  updateQuizQuestion,
  updateQuestion,
  deleteQuestionsByCourseId,
};
