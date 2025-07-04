const express = require('express');
const controlAuthController = require('../controllers/controlAuthController.js');
const ActivityStaffAuthController = require('../controllers/ActivityStaffAuthController.js');
const affairsAuthController = require('../controllers/affairsAuthController.js');
const StaffController = require('../controllers/staffController.js');
const router = express.Router();
const middleware = require('../middleware/protect.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for user authentication
 */

/**
 * @swagger
 * /api/v1/control/login:
 *   post:
 *     summary: Control staff login
 *     description: Allows control staff to log in to the system using their credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Control staff email
 *                 example: control@example.com
 *               password:
 *                 type: string
 *                 description: Password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in and token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "your-jwt-token"
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/activity_staff/login:
 *   post:
 *     summary: Activity staff login
 *     description: Allows activity staff to log in to the system using their credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: activity@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in and token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "your-jwt-token"
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/affairs/login:
 *   post:
 *     summary: Affairs staff login
 *     description: Allows affairs staff to log in to the system using their credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: affairs@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in and token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "your-jwt-token"
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /api/v1/forgotPassword:
 *   post:
 *     summary: Send password reset token to staff email
 *     description: Sends a reset token to the email of the staff member to reset the password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: staff@example.com
 *     responses:
 *       200:
 *         description: Token sent to email successfully
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Error sending the email
 */

/**
 * @swagger
 * /api/v1/resetPassword/{token}:
 *   patch:
 *     summary: Reset password using reset token
 *     description: Resets the staff's password using the provided reset token.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The reset token sent to the staff's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               passwordConfirm:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Token is invalid or has expired
 */

/**
 * @swagger
 * /api/v1/updatePassword:
 *   patch:
 *     summary: Update staff password while logged in
 *     description: Allows a logged-in staff member to update their password by providing the current password.
 *     tags: [Auth]
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
 *                 example: currentpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *               confirmNewPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Passwords do not match or invalid input
 *       401:
 *         description: Current password is incorrect
 */


// Routes
router.route('/control/login').post(controlAuthController.log_in);
router.route('/forgotPassword').post(StaffController.forgotPassword);
router.route('/resetPassword/:token').patch(StaffController.resetPassword);
router.route('/updatePassword').patch(middleware.protect, StaffController.updatePassword);
router.route('/activity_staff/login').post(ActivityStaffAuthController.log_in);
router.route('/affairs/login').post(affairsAuthController.log_in);
module.exports = router;
