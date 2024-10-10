const createLesson = async (conn, chapterId, type, content, order) => {
  const [result] = await conn.execute(
    "INSERT INTO lessons (chapter_id, type, content, `order`) VALUES (?, ?, ?, ?)",
    [chapterId, type, content, order]
  );
  return result.insertId;
};

const updateVideoLesson = async (conn, lessonId, videoUrl) => {
  const [result] = await conn.execute(
    "UPDATE lessons SET video_url = ? WHERE lesson_id = ?",
    [videoUrl, lessonId]
  );
  return result.affectedRows;
};

const getLessonsByChapterId = async (conn, chapterId) => {
  const [rows] = await conn.execute(
    "SELECT * FROM lessons WHERE chapter_id = ? ORDER BY `order`",
    [chapterId]
  );
  return rows;
};

const updateLesson = async (conn, lessonId, type, content, order) => {
  const [result] = await conn.execute(
    "UPDATE lessons SET type = ?, content = ?, `order` = ? WHERE lesson_id = ?",
    [type, content, order, lessonId]
  );
  return result.affectedRows;
};

const deleteLessonsByCourseId = async (conn, courseId) => {
  await conn.execute(
    `DELETE l FROM lessons l
     INNER JOIN chapters c ON l.chapter_id = c.chapter_id
     WHERE c.course_id = ?`,
    [courseId]
  );
};

module.exports = {
  createLesson,
  updateVideoLesson,
  getLessonsByChapterId,
  updateLesson,
  deleteLessonsByCourseId,
};
