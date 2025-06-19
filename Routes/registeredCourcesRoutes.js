const express = require('express');
const { getAllCourses, addCourse } = require('../controllers/registeredCoursesController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RegisteredCourses
 *   description: API to manage student course registrations
 */

/**
 * @swagger
 * /api/v1/registeredCourses:
 *   post:
 *     summary: Register a student for a course
 *     description: Registers a student for a course by adding the student ID and course IDs.
 *     tags: [RegisteredCourses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student
 *               - courses
 *             properties:
 *               student:
 *                 type: string
 *                 description: ID of the student to be registered
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: IDs of the courses the student is registering for
 *     responses:
 *       201:
 *         description: Successfully registered the student for the courses
 *       400:
 *         description: Bad request (e.g., invalid student or courses)
 */
router
    .route('/')
    .post(addCourse)  // Remove protect middleware here
    // .get(getAllCourses); // No protection applied for this route

module.exports = router;
