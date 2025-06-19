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
 * /api/v1/login:
 *   post:
 *     summary: User login
 *     description: Allows users to log in to the system using their credentials.
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
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
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
 *                   description: Auth token for the user
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SkNjDjO1I64OtYwfp-FW5bAsXt-4oDNXw7kl9t9RzL_w"
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 */
router
    .route('/control/login')

    .post(controlAuthController.log_in);
router
    .route('/activity_staff/login')

    .post(ActivityStaffAuthController.log_in);
router
    .route('/affairs/login')

    .post(affairsAuthController.log_in);        

    

module.exports = router;
