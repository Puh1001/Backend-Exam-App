const createAnswer = async (conn, questionId, content, answerLetter) => {
  const [result] = await conn.execute(
    "INSERT INTO answers (question_id, answer_content, answer_letter) VALUES (?, ?, ?)",
    [questionId, content, answerLetter]
  );
  return result.insertId;
};

module.exports = {
  createAnswer,
};
