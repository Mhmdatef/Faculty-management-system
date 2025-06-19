const express = require('express');
const courseController = require('../controllers/courseController');
const middleware = require('./../middleware/protect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API to manage courses
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Add a new course
 *     description: Add a new course (only "student_affairs" can do this).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - creditHours
 *               - term
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               creditHours:
 *                 type: number
 *               term:
 *                 type: number
 *               department:
 *                 type: string
 *                 description: ID of the department
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of prerequisite course codes
 *     responses:
 *       201:
 *         description: Course successfully created
 *       400:
 *         description: Bad request
 */
router
    .route('/')
    .post(
      middleware.protect,middleware.restrictTo("student_affairs"),
        courseController.addCourse
    )
/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a list of all courses (only "student_affairs" can access).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *       400:
 *         description: Bad request
 */
    .get(
        courseController.getAllCourses
    );

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Retrieve a specific course by its ID (only "student_affairs" can access).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Course data
 *       404:
 *         description: Course not found
 */
router
    .route('/:id')
    .get(
        
        courseController.getCourseById
    )
/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     description: Update an existing course by ID (only "student_affairs" can update).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               creditHours:
 *                 type: number
 *               term:
 *                 type: number
 *               department:
 *                 type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Course not found
 */
    .patch(
        middleware.protect,
        middleware.restrictTo("student_affairs"),
        courseController.updateCourse
    )
/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete an existing course by ID (only "student_affairs" can delete).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
    .delete(
        middleware.protect,
        middleware.restrictTo("student_affairs"),
        courseController.deleteCourse
    );
/**
 * @swagger
 * /api/v1/courses/course/{name}:
 *   get:
 *     summary: Get a course by name
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The course name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The course details.  
 *       404:
 *         description: course not found.
 */
/**
 * @swagger
 * /api/v1/courses/assign-to-department:
 *   post:
 *     summary: Assign a course to a department
 *     description: Assign an existing course to a department (only "student_affairs" can do this).
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - departmentId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course
 *               departmentId:
 *                 type: string
 *                 description: The ID of the department
 *     responses:
 *       200:
 *         description: Course successfully assigned to department
 *       404:
 *         description: Course or department not found
 */
router.post(
  '/assign-to-department',
        middleware.protect,middleware.restrictTo("student_affairs"),
  courseController.assignCourseToDepartment
);


router.get('/course/:name', 
          middleware.protect,middleware.restrictTo("student_affairs"),
courseController.getCourseByName);    

module.exports = router;
