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

const createQuestion = async (lessonId, content, correctAnswer) => {
  const conn = await db.getConnection();
  try {
    const questionId = await questionsModel.createQuestion(
      conn,
      lessonId,
      content,
      correctAnswer
    );
    return questionId;
  } finally {
    conn.release();
  }
};

const getQuestionsByLessonId = async (lessonId) => {
  const conn = await db.getConnection();
  try {
    const questions = await questionsModel.getQuestionsByLessonId(
      conn,
      lessonId
    );
    return questions;
  } finally {
    conn.release();
  }
};

const updateQuestion = async (questionId, content, correctAnswer) => {
  const conn = await db.getConnection();
  try {
    const affectedRows = await questionsModel.updateQuestion(
      conn,
      questionId,
      content,
      correctAnswer
    );
    return affectedRows;
  } finally {
    conn.release();
  }
};

const deleteQuestionsByCourseId = async (courseId) => {
  const conn = await db.getConnection();
  try {
    await questionsModel.deleteQuestionsByCourseId(conn, courseId);
  } finally {
    conn.release();
  }
};

module.exports = {
  addQuizQuestion,
  createQuestion,
  getQuestionsByLessonId,
  updateQuestion,
  deleteQuestionsByCourseId,
};
