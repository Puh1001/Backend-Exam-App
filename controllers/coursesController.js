const expressAsyncHandler = require("express-async-handler");
const db = require("../configs/db");
const coursesService = require("../services/coursesService");

const createCourse = expressAsyncHandler(async (req, res) => {
  const { courseName, author, price, thumbnail, subject } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const courseId = await coursesService.addCourse(
      conn,
      courseName,
      author,
      price,
      thumbnail,
      subject
    );
    await conn.commit();
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { courseId },
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the course!",
    });
    console.log(err);
  } finally {
    conn.release();
  }
});

const getAllCourses = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const courses = await coursesService.getAllCourses(conn);
    await conn.commit();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses!",
    });
    console.log(err);
  }
});

const getCourseById = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const course = await coursesService.getCourseById(conn, req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    await conn.commit();
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the course!",
    });
    console.log(err);
  } finally {
    conn.release();
  }
});

const updateCourse = expressAsyncHandler(async (req, res) => {
  const { courseName, description, author_id, price, isPublished, subject_id } =
    req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await coursesService.updateCourse(
      conn,
      req.params.id,
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
