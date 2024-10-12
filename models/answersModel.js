const createAnswer = async (conn, questionId, content, answerLetter) => {
  const [result] = await conn.execute(
    "INSERT INTO answers (question_id, answer_content, answer_letter) VALUES (?, ?, ?)",
    [questionId, content, answerLetter]
  );
  return result.insertId;
};

const getAnswersByQuestionId = async (conn, questionId) => {
  const [rows] = await conn.execute(
    "SELECT * FROM answers WHERE question_id = ?",
    [questionId]
  );
  return rows;
};

const updateAnswer = async (conn, answerId, answerContent, answerLetter) => {
  const [result] = await conn.execute(
    "UPDATE answers SET answer_content = ?, answer_letter = ? WHERE answer_id = ?",
    [answerContent, answerLetter, answerId]
  );
  return result.affectedRows;
};

const deleteAnswersByCourseId = async (conn, courseId) => {
  await conn.execute(
    `DELETE a FROM answers a
     INNER JOIN questions q ON a.question_id = q.question_id
     INNER JOIN lessons l ON q.exam_id = l.lesson_id
     INNER JOIN chapters c ON l.chapter_id = c.chapter_id
     WHERE c.course_id = ?`,
    [courseId]
  );
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswersByCourseId,
};
