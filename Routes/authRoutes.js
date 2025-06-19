const express = require('express');
const controlAuthController = require('../controllers/controlAuthController.js');
const ActivityStaffAuthController = require('../controllers/ActivityStaffAuthController.js');
const affairsAuthController = require('../controllers/affairsAuthController.js');
const router = express.Router();

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

// Routes
router.route('/control/login').post(controlAuthController.log_in);
router.route('/activity_staff/login').post(ActivityStaffAuthController.log_in);
router.route('/affairs/login').post(affairsAuthController.log_in);

module.exports = router;
