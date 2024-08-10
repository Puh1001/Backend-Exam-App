const expressAsyncHandler = require("express-async-handler");
const coursesService = require("../services/coursesService");
const chaptersService = require("../services/chaptersService");
const lessionsService = require("../services/lessionsService");
const questionsService = require("../services/questionsService");
const db = require("../configs/db");

const createCourse = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    const { courseName, chapters, author, price, thumbnail, subject } =
      req.body;

    // Insert course
    const courseId = await coursesService.addCourse(
      conn,
      courseName,
      author,
      price,
      thumbnail,
      subject
    );

    // Insert chapters and lessons
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const chapterId = await chaptersService.addChapter(
        conn,
        courseId,
        chapter.name,
        i + 1
      );

      for (let j = 0; j < chapter.lessons.length; j++) {
        const lesson = chapter.lessons[j];
        const lessonId = await lessionsService.addLesson(
          conn,
          chapterId,
          lesson.type,
          lesson.content,
          j + 1
        );

        if (lesson.type === "quiz") {
          await questionsService.addQuizQuestion(
            conn,
            lessonId,
            lesson.content,
            lesson.options,
            lesson.correctAnswer
          );
        } else if (lesson.type === "video") {
          await lessionsService.updateVideoLesson(
            conn,
            lessonId,
            lesson.content
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({
      success: true,
      message: "New course added successfully",
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred in creating the course!",
    });
    console.log(err);
  } finally {
    conn.release();
  }
});

const getAllCourses = expressAsyncHandler(async (req, res) => {
  try {
    const courses = await coursesService.getAllCourses();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses!",
    });
    console.log(err);
  }
});

const getCourseById = expressAsyncHandler(async (req, res) => {
  try {
    const course = await coursesService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the course!",
    });
    console.log(err);
  }
});

const updateCourse = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const {
      courseName,
      description,
      author_id,
      price,
      isPublished,
      subject_id,
    } = req.body;
    const courseId = req.params.id;

    await coursesService.updateCourse(
      conn,
      courseId,
      courseName,
      description,
      author_id,
      price,
      isPublished,
      subject_id
    );
    await conn.commit();
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the course!",
    });
    console.log(err);
  } finally {
    conn.release();
  }
});

const deleteCourse = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const courseId = req.params.id;

    await coursesService.deleteCourse(conn, courseId);
    await conn.commit();
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course!",
    });
    console.log(err);
  } finally {
    conn.release();
  }
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
