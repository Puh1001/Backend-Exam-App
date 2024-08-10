const createQuestion = async (conn, lessonId, content, correctAnswer) => {
  const [result] = await conn.execute(
    "INSERT INTO questions (exam_id, question_content, correct_answer) VALUES (?, ?, ?)",
    [lessonId, content, correctAnswer]
  );
  return result.insertId;
};

module.exports = {
  createQuestion,
};
