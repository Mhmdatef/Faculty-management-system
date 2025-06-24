const express = require('express');
const middleware = require('./../middleware/protect');
const studentController = require('../controllers/student-controller');
const multer = require('multer');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The students managing API
 */

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
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
 *         description: A list of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 */
router.route('/')
  .post(middleware.protect, middleware.restrictTo("student_affairs"), studentController.addOneStudent)
  .get(studentController.getAllStudents);

/**
 * @swagger
 * /api/v1/students/updatePassword:
 *   patch:
 *     summary: Update student password
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.route('/updatePassword').patch(middleware.studentProtect, studentController.updatePassword);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details retrieved.
 *       404:
 *         description: Student not found.
 *   patch:
 *     summary: Update student details
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Student updated.
 *       400:
 *         description: Error updating.
 *       404:
 *         description: Student not found.
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted.
 *       404:
 *         description: Student not found.
 */
router.route('/:id')
  .get(studentController.getOneStudentByID)
  .patch(middleware.protect, middleware.restrictTo("student_affairs"), studentController.updateOneStudent)
  .delete(middleware.protect, middleware.restrictTo("student_affairs"), studentController.deleteOneStudent);

/**
 * @swagger
 * /api/v1/students/student/{name}:
 *   get:
 *     summary: Get a student by name
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student details retrieved.
 *       404:
 *         description: Student not found.
 */
router.get('/student/:name', middleware.protect, middleware.restrictTo("student_affairs"), studentController.getOneStudentByName);

/**
 * @swagger
 * /api/v1/students/login:
 *   post:
 *     summary: Student login
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 */
router.route('/login').post(studentController.log_in);

// Multer setup
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/v1/students/upload:
 *   post:
 *     summary: Upload students via Excel file
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Upload successful.
 *       400:
 *         description: Invalid file.
 */
router.post('/upload', middleware.protect, middleware.restrictTo("student_affairs"), upload.single('file'), studentController.importStudentsFromExcel);

module.exports = router;
