const createChapter = async (conn, courseId, chapterName, order) => {
  const [result] = await conn.execute(
    "INSERT INTO chapters (course_id, name, `order`) VALUES (?, ?, ?)",
    [courseId, chapterName, order]
  );
  return result.insertId;
};

const deleteChaptersByCourseId = async (conn, courseId) => {
  await conn.execute(`DELETE FROM chapters WHERE course_id = ?`, [courseId]);
};

module.exports = {
  createChapter,
  deleteChaptersByCourseId,
};
