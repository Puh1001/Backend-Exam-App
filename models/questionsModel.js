const createQuestion = async (conn, lessonId, content, correctAnswer) => {
  const [result] = await conn.execute(
    "INSERT INTO questions (exam_id, question_content, correct_answer) VALUES (?, ?, ?)",
    [lessonId, content, correctAnswer]
  );
  return result.insertId;
};

const deleteQuestionsByCourseId = async (conn, courseId) => {
  await conn.execute(
    `DELETE q FROM questions q
     INNER JOIN lessons l ON q.exam_id = l.lesson_id
     INNER JOIN chapters c ON l.chapter_id = c.chapter_id
     WHERE c.course_id = ?`,
    [courseId]
  );
};

module.exports = {
  createQuestion,
  deleteQuestionsByCourseId,
};
