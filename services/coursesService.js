const coursesModel = require("../models/coursesModel");
const chaptersModel = require("../models/chapersModel");
const lessonsModel = require("../models/lessionsModel");
const questionsModel = require("../models/questionsModel");
const answersModel = require("../models/answersModel");

const getSubjectIdByName = async (conn, name) => {
  const [rows] = await conn.execute(
    "SELECT subject_id FROM subjects WHERE subject_name = ?",
    [name]
  );
  return rows[0] ? rows[0].subject_id : null;
};

const addCourse = async (
  conn,
  courseName,
  author,
  price,
  thumbnail,
  subject
) => {
  const subjectId = await getSubjectIdByName(conn, subject);

  return await coursesModel.createCourse(
    conn,
    courseName,
    author,
    price,
    thumbnail,
    subjectId
  );
};

const getAllCourses = async () => {
  return await coursesModel.getAllCourses();
};

const getCourseById = async (conn, id) => {
  const course = await coursesModel.getCourseById(id);
  if (course) {
    course.chapters = await chaptersModel.getChaptersByCourseId(
      conn,
      course.course_id
    );
    for (const chapter of course.chapters) {
      chapter.lessons = await lessonsModel.getLessonsByChapterId(
        conn,
        chapter.chapter_id
      );
      for (const lesson of chapter.lessons) {
        lesson.questions = await questionsModel.getQuestionsByLessonId(
          conn,
          lesson.lesson_id
        );
        for (const question of lesson.questions) {
          question.answers = await answersModel.getAnswersByQuestionId(
            conn,
            question.question_id
          );
        }
      }
    }
  }
  return course;
};

const updateCourse = async (
  conn,
  id,
  courseName,
  description,
  author_id,
  price,
  isPublished,
  subject_id
) => {
  return await coursesModel.updateCourse(
    conn,
    id,
    courseName,
    description,
    author_id,
    price,
    isPublished,
    subject_id
  );
};

const deleteCourse = async (conn, courseId) => {
  return await coursesModel.deleteCourseById(conn, courseId);
};

module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
