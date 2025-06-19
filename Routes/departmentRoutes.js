const express = require('express');
const departmentController = require('../controllers/departmentController');
const middleware = require('./../middleware/protect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API to manage university departments
 */

/**
 * @swagger
 * /api/v1/departments:
 *   post:
 *     summary: Add a new department
 *     description: Create a new department by specifying its name and head of department.
 *     tags: [Departments]
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
 *               - headOfDepartment
 *             properties:
 *               name:
 *                 type: string
 *                 description: Department name
 *               headOfDepartment:
 *                 type: string
 *                 description: Name of the department head
 *     responses:
 *       201:
 *         description: Department successfully created
 *       400:
 *         description: Bad request
 */
router
  .route('/')
  .post(
              middleware.protect,middleware.restrictTo("student_affairs"),
    
    departmentController.addDepartment
  )

/**
 * @swagger
 * /api/v1/departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *       400:
 *         description: Bad request
 */
  .get(
             middleware.protect,middleware.restrictTo("student_affairs"),
   
    departmentController.getAllDepartments
  );

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     description: Retrieve a specific department by its ID.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 */
router
  .route('/:id')
  .get(
             middleware.protect,middleware.restrictTo("student_affairs"),
   
    departmentController.getOneDepartmentByID
  )

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   patch:
 *     summary: Update a department
 *     description: Update the details of a department using its ID.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the department
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
 *               headOfDepartment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 */
  .patch(
              middleware.protect,middleware.restrictTo("student_affairs"),
    

    departmentController.updateDepartment
  )

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     description: Delete a department by its ID.
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the department
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
  .delete(
             middleware.protect,middleware.restrictTo("student_affairs"),
   
    departmentController.deleteDepartment
  );

module.exports = router;
