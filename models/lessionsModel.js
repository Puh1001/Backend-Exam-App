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

module.exports = {
  createLesson,
  updateVideoLesson,
};
