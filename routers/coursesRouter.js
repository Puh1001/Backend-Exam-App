const express = require("express");
const coursesController = require("../controllers/coursesController");

const middlewares = require("../middlewares/auth");

const router = express.Router();

// Add Coursses
router.post(
  "/addCourse",
  middlewares.auth,
  middlewares.authorize(1),
  coursesController.createCourse
);

// Read Courses
router.get("/getAllCourses", middlewares.auth, coursesController.getAllCourses);
router.get("/getCourse/:id", middlewares.auth, coursesController.getCourseById);

// Update Course
router.put(
  "/updateCourse/:id",
  middlewares.auth,
  middlewares.authorize(1),
  coursesController.updateCourse
);

// Delete Course
router.delete(
  "/deleteCourse/:id",
  middlewares.auth,
  middlewares.authorize(1),
  coursesController.deleteCourse
);

module.exports = router;
