const createChapter = async (conn, courseId, chapterName, order) => {
  const [result] = await conn.execute(
    "INSERT INTO chapters (course_id, name, `order`) VALUES (?, ?, ?)",
    [courseId, chapterName, order]
  );
  return result.insertId;
};

const deleteChapter = async (conn, id) => {
  const [result] = await conn.execute(
    "DELETE FROM chapters WHERE course_id = ?",
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  createChapter,
  deleteChapter,
};
