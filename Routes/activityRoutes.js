const express = require('express');
const activityController = require('../controllers/activityController');
const middleware = require('./../middleware/protect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: API to manage activities
 */

/**
 * @swagger
 * /api/v1/activities:
 *   post:
 *     summary: Add a new activity
 *     description: Add a new activity by specifying type, description, and student ID.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - activityDescription
 *               - student
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the activity (e.g., Sports, Art, Science Club)
 *               description:
 *                 type: string
 *                 description: A description of the activity
 *               student:
 *                 type: string
 *                 description: ID of the student associated with the activity
 *     responses:
 *       201:
 *         description: Activity successfully created
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all activities
 *     description: Retrieve a list of all activities.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of activities
 *       401:
 *         description: Unauthorized
 */
router.route('/')
    .post(middleware.protect,middleware.restrictTo("activity_staff"),activityController.addActivity)
    .get( middleware.protect,middleware.restrictTo("activity_staff"),activityController.getAllActivities);

/**
 * @swagger
 * /api/v1/activities/{id}:
 *   get:
 *     summary: Get a single activity by ID
 *     description: Retrieve a specific activity by its ID.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the activity to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved activity
 *       404:
 *         description: Activity not found
 *   patch:
 *     summary: Update an existing activity
 *     description: Update activity details using its ID.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the activity to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityType:
 *                 type: string
 *               activityDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated activity
 *       400:
 *         description: Bad request
 *       404:
 *         description: Activity not found
 *   delete:
 *     summary: Delete an activity
 *     description: Delete an activity using its ID.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the activity to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Activity deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user doesn't have permission
 *       404:
 *         description: Activity not found
 */
router.route('/:id')
    .get(middleware.protect,middleware.restrictTo("activity_staff"), activityController.getOneActivityByID)
    .patch(middleware.protect,middleware.restrictTo("activity_staff"), activityController.updateActivity)
    .delete(middleware.protect,middleware.restrictTo("activity_staff"), activityController.deleteActivity);

module.exports = router;
