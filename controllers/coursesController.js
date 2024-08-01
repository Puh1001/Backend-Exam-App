const expressAsyncHandler = require("express-async-handler");
const coursesService = require("../services/coursesService");
const db = require("../configs/db");

const createCourse = expressAsyncHandler(async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    const { courseName, description, price, isPublished, subject_id, user_id } =
      req.body;
    if (
      !courseName ||
      !description ||
      !price ||
      !isPublished ||
      !subject_id ||
      !user_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    await coursesService.addCourse(
      conn,
      courseName,
      description,
      price,
      isPublished,
      subject_id,
      user_id
    );
    await conn.commit();
    res.status(201).json({
      success: true,
      message: "New courses add successfully",
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      success: false,
      message: "An error in create course!",
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
    const { courseName, description, price, isPublished, subject_id, user_id } =
      req.body;
    const courseId = req.params.id;

    await coursesService.updateCourse(
      conn,
      courseId,
      courseName,
      description,
      price,
      isPublished,
      subject_id,
      user_id
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
