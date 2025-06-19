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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: number
 *               studentID:
 *                 type: number
 *               totalCreditsCompleted:
 *                 type: number
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *               registerdCourses:
 *                 type: array
 *                 items:
 *                   type: string
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
  .post(          middleware.protect,middleware.restrictTo("student_affairs"),
  studentController.addOneStudent)
  .get(         
  studentController.getAllStudents);

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
 *         description: The student name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The student details.
 *       404:
 *         description: Student not found.
 */

router.get('/student/:name'  ,       middleware.protect,middleware.restrictTo("student_affairs")
, studentController.getOneStudentByName);

router.route('/:id')
  .get(      
  studentController.getOneStudentByID)
  .patch(          middleware.protect,middleware.restrictTo("student_affairs"),
  studentController.updateOneStudent)
  .delete(          middleware.protect,middleware.restrictTo("student_affairs"),
  studentController.deleteOneStudent);

/**
 * @swagger
 * /api/v1/students/login:
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
  .post( 
  studentController.log_in);

// إعداد Multer لرفع الملفات
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/v1/students/upload:
 *   post:
 *     summary: Upload an Excel file with student data
 *     tags: [Students]
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
 *                 description: The Excel file containing student data
 *     responses:
 *       200:
 *         description: Students uploaded successfully
 *       400:
 *         description: Bad request or invalid Excel data
 */
router.post('/upload',           middleware.protect,middleware.restrictTo("student_affairs"),
upload.single('file'), studentController.importStudentsFromExcel);

module.exports = router;
