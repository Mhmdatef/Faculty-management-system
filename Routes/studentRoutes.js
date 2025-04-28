const express = require('express');
const middleware = require('./../middleware/protect');
const studentController = require('../controllers/student-controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The students managing API
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student
 *               level:
 *                 type: number
 *                 description: The level of the student
 *               studentID:
 *                 type: number
 *                 description: The unique student ID
 *               totalCreditsCompleted:
 *                 type: number
 *                 description: The total credits the student has completed
 *               email:
 *                 type: string
 *                 description: The student's email
 *               password:
 *                 type: string
 *                 description: The password for the student
 *               passwordConfirm:
 *                 type: string
 *                 description: The confirmation for the student's password
 *               phone:
 *                 type: string
 *                 description: The student's phone number
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The student's date of birth
 *               gender:
 *                 type: string
 *                 description: The student's gender
 *                 enum:
 *                   - Male
 *                   - Female
 *     responses:
 *       201:
 *         description: The student was successfully created.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students.
 *       400:
 *         description: Error fetching students.
 */
router.route('/')
  .post(middleware.protect, middleware.restrictTo("student_affairs"), studentController.addOneStudent)
  .get(middleware.protect, middleware.restrictTo("student_affairs"), studentController.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The student details.
 *       404:
 *         description: Student not found.
 *   patch:
 *     summary: Update student details
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student
 *               level:
 *                 type: number
 *                 description: The level of the student
 *               studentID:
 *                 type: number
 *                 description: The unique student ID
 *               totalCreditsCompleted:
 *                 type: number
 *                 description: The total credits the student has completed
 *               email:
 *                 type: string
 *                 description: The student's email
 *               phone:
 *                 type: string
 *                 description: The student's phone number
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: The student's date of birth
 *               gender:
 *                 type: string
 *                 description: The student's gender
 *                 enum:
 *                   - Male
 *                   - Female
 *     responses:
 *       200:
 *         description: The student was successfully updated.
 *       400:
 *         description: Error updating student.
 *       404:
 *         description: Student not found.
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The student ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The student was successfully deleted.
 *       404:
 *         description: Student not found.
 */
router.route('/:id')
  .get(studentController.getOneStudentByID)
  .patch(studentController.updateOneStudent)
  .delete(middleware.protect, middleware.restrictTo("student_affairs"), studentController.deleteOneStudent);

/**
 * @swagger
 * /students/login:
 *   post:
 *     summary: Log in a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the student
 *               password:
 *                 type: string
 *                 description: The password of the student
 *     responses:
 *       200:
 *         description: Successfully logged in and received a token.
 *       400:
 *         description: Invalid email or password.
 */
router.route('/login')
  .post(studentController.log_in);

module.exports = router;
