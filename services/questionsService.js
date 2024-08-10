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

module.exports = {
  addQuizQuestion,
};
