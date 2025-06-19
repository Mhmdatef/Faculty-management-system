const express = require('express');
const staffController = require('../controllers/staffController.js');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: API for managing staff members
 */

/**
 * @swagger
 * /api/v1/staff:
 *   post:
 *     summary: Add a new staff member
 *     description: Add a new staff member to the system.
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff member successfully added
 *       400:
 *         description: Invalid input or missing fields
 *   get:
 *     summary: Get all staff members
 *     description: Retrieve a list of all staff members in the system.
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: List of staff members
 *       400:
 *         description: Error retrieving staff members
 */

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   get:
 *     summary: Get a staff member by ID
 *     description: Retrieve a specific staff member using their ID.
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the staff member to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff member retrieved successfully
 *       404:
 *         description: Staff member not found
 *   patch:
 *     summary: Update staff member details
 *     description: Update details of an existing staff member by their ID.
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the staff member to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Successfully updated the staff member
 *       400:
 *         description: Invalid input or missing fields
 *       404:
 *         description: Staff member not found
 *   delete:
 *     summary: Delete a staff member
 *     description: Delete a staff member by their ID.
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the staff member to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Staff member successfully deleted
 *       404:
 *         description: Staff member not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - universityEmail
 *         - phoneNumber
 *         - role
 *         - password
 *         - passwordConfirm
 *       properties:
 *         name:
 *           type: string
 *           description: The full name of the staff member
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The personal email address of the staff member
 *           example: "john.doe@example.com"
 *         universityEmail:
 *           type: string
 *           description: The university email address of the staff member
 *           example: "johndoe@university.edu"
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the staff member
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           description: The role of the staff member
 *           enum: [control, student_affairs, activity_staff]
 *           example: "student_affairs"
 *         password:
 *           type: string
 *           description: The password for the staff member
 *           example: "securePassword123"
 *         passwordConfirm:
 *           type: string
 *           description: The confirmation of the password
 *           example: "securePassword123"
 *         passwordChangedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the password was last changed
 *           example: "2025-04-28T10:30:00Z"
 */

router.route('/')
    .post(staffController.addStaff) // إضافة موظف جديد
    .get(staffController.getAllStaff); // جلب كل الموظفين

router.route('/:id')
    .get(staffController.getOneStaffByID) // جلب موظف معين
    .patch(staffController.updateStaff) // تحديث بيانات الموظف
    .delete(staffController.deleteStaff); // حذف موظف

module.exports = router;
