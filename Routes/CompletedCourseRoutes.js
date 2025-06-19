const express = require('express');
const multer = require('multer');
const middleware = require('../middleware/protect');
const completedCourseController = require('../controllers/completedCourseController');

const router = express.Router();

// إعداد multer لرفع الملفات (تخزين مؤقت في مجلد "uploads")
const uploads = multer({ dest: 'uploads/' });

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
  .post(middleware.protect,middleware.restrictTo("student_affairs"), completedCourseController.addcompletedCourse);

/**
 * @swagger
 * /api/v1/completedCourses/upload:
 *   post:
 *     summary: Import completed courses from Excel file
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
 *                 description: Excel file containing studentName, courseName, and grade
 *     responses:
 *       201:
 *         description: Completed courses imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 count:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     completedCourses:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad request (missing fields or invalid grade)
 *       500:
 *         description: Internal server error
 */


router.post('/upload',middleware.protect,middleware.restrictTo("control"), uploads.single('file'), completedCourseController.importCompletedCoursesFromExcel);

router
  .route('/')
  .get(middleware.protect,middleware.restrictTo("control"), completedCourseController.getAllCompletedCourses)


module.exports = router;
