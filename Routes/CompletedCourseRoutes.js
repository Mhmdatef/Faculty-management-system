const express = require('express');
const completedCourseController = require('../controllers/completedCourseController');
const middleware = require('./../middleware/protect');
const router = express.Router();

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
 *               studentId:
 *                 type: string
 *                 description: The student's ID who completed the course
 *                 example: "123456"
 *               courseId:
 *                 type: string
 *                 description: The ID of the completed course
 *                 example: "abc123"

 *               grade:
 *                 type: string
 *                 enum: [A, B, C, D, F]
 *                 description: The grade received by the student for the course
 *                 example: "A"
 *     responses:
 *       201:
 *         description: Successfully added completed course with grade
 *       400:
 *         description: Invalid input data
 */

// /**
//  * @swagger
//  * /api/v1/completedCourses:
//  *   get:
//  *     summary: Get all completed courses
//  *     description: Retrieves a list of all completed courses in the system.
//  *     tags: [CompletedCourses]
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved the list of completed courses
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   studentId:
//  *                     type: string
//  *                     description: The ID of the student
//  *                   courseId:
//  *                     type: string
//  *                     description: The ID of the course

//  *                   grade:
//  *                     type: string
//  *                     description: The grade the student received in the course
//  *                     enum: [A, B, C, D, F]
//  *                     example: "B"
//  *       500:
//  *         description: Internal server error
//  */
router
    .route('/')
    .post(completedCourseController.addcompletedCourse)
    // .get(completedCourseController.getAllcompletedCourse);

module.exports = router;
