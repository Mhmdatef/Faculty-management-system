const express = require('express');
const multer = require('multer');
const completedCourseController = require('../controllers/completedCourseController');

const router = express.Router();

// إعداد multer لرفع الملفات (تخزين مؤقت في مجلد "uploads")
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: CompletedCourses
 *   description: API for managing completed courses
 */

/**
 * @swagger
 * /api/v1/completedCourses:
 *   post:
 *     summary: Add a completed course
 *     description: Allows the admin to add a completed course with a grade to the system.
 *     tags: [CompletedCourses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student:
 *                 type: string
 *                 description: The student's ID who completed the course
 *                 example: "6621c0e8a9fef8e5b3456789"
 *               course:
 *                 type: string
 *                 description: The ID of the completed course
 *                 example: "6621b3e5a9fef8e5b3345678"
 *               grade:
 *                 type: string
 *                 enum: [A, B, C, D, F]
 *                 description: The grade received by the student
 *                 example: "A"
 *     responses:
 *       201:
 *         description: Successfully added completed course with grade
 *       400:
 *         description: Invalid input data
 */
router
  .route('/')
  .post(completedCourseController.addcompletedCourse);

/**
 * @swagger
 * /api/v1/completedCourses/upload:
 *   post:
 *     summary: Import completed courses from Excel file (by course/student name)
 *     tags: [CompletedCourses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xlsx) containing completed courses
 *                 example: "completed_courses.xlsx"
 *     responses:
 *       201:
 *         description: Completed courses imported successfully
 *       400:
 *         description: Bad request - missing fields or invalid data
 *       500:
 *         description: Server error while processing the Excel file
 */
router.post('/upload', upload.single('file'), completedCourseController.importCompletedCoursesFromExcel);

module.exports = router;
