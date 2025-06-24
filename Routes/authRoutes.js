const express = require('express');
const controlAuthController = require('../controllers/controlAuthController.js');
const ActivityStaffAuthController = require('../controllers/ActivityStaffAuthController.js');
const affairsAuthController = require('../controllers/affairsAuthController.js');
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
 * /api/v1/staff/update_password:
 *   patch:
 *     summary: Update staff password
 *     description: Allows a logged-in staff member to update their password.
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
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass456
 *               confirmNewPassword:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password updated successfully and new token returned
 *       400:
 *         description: Bad request (e.g., passwords don’t match)
 *       401:
 *         description: Unauthorized (e.g., invalid or expired token)
 *       404:
 *         description: Staff not found
 */


// Routes
router.route('/control/login').post(controlAuthController.log_in);
router.route('/activity_staff/login').post(ActivityStaffAuthController.log_in);
router.route('/affairs/login').post(affairsAuthController.log_in);
router.route('/staff/update_password').patch(middleware.protect, controlAuthController.updatePassword);

module.exports = router;
