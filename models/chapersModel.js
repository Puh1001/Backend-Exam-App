const createChapter = async (conn, courseId, chapterName, order) => {
  const [result] = await conn.execute(
    "INSERT INTO chapters (course_id, name, `order`) VALUES (?, ?, ?)",
    [courseId, chapterName, order]
  );
  return result.insertId;
};

module.exports = {
  createChapter,
};
