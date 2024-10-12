const createChapter = async (conn, courseId, chapterName, order) => {
  const [result] = await conn.execute(
    "INSERT INTO chapters (course_id, name, `order`) VALUES (?, ?, ?)",
    [courseId, chapterName, order]
  );
  return result.insertId;
};

const getChaptersByCourseId = async (conn, courseId) => {
  const [rows] = await conn.execute(
    "SELECT * FROM chapters WHERE course_id = ? ORDER BY `order`",
    [courseId]
  );
  return rows;
};

const updateChapter = async (conn, chapterId, chapterName, order) => {
  await conn.execute(
    "UPDATE chapters SET name = ?, `order` = ? WHERE chapter_id = ?",
    [chapterName, order, chapterId]
  );
};

const deleteChaptersByCourseId = async (conn, courseId) => {
  await conn.execute(`DELETE FROM chapters WHERE course_id = ?`, [courseId]);
};

module.exports = {
  createChapter,
  getChaptersByCourseId,
  updateChapter,
  deleteChaptersByCourseId,
};
