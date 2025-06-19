const express = require('express');
const router = express.Router();
const prerequisiteController = require('../controllers/prerequisiteController');

router
    .route('/')
    .post(prerequisiteController.addPrerequisite)
    .get(prerequisiteController.getAllPrerequisites);

router
    .route('/:id')
    .delete(prerequisiteController.deletePrerequisite);

router
    .route('/course/:courseId')
    .get(prerequisiteController.getCoursePrerequisites);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Prerequisites
 *   description: API for managing course prerequisites
 */

/**
 * @swagger
 * /api/v1/prerequisites:
 *   post:
 *     summary: Add a new prerequisite
 *     tags: [Prerequisites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *                 example: 665b12f4cba9ad27e0fef123
 *               prerequisite:
 *                 type: string
 *                 example: 665b130ccba9ad27e0fef456
 *     responses:
 *       201:
 *         description: Prerequisite added successfully
 *       400:
 *         description: Bad request or duplicate prerequisite
 *
 *   get:
 *     summary: Get all prerequisite mappings
 *     tags: [Prerequisites]
 *     responses:
 *       200:
 *         description: List of prerequisites
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/prerequisites/{id}:
 *   delete:
 *     summary: Delete a prerequisite by ID
 *     tags: [Prerequisites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Prerequisite deleted successfully
 *       404:
 *         description: Prerequisite not found
 */

/**
 * @swagger
 * /api/v1/prerequisites/course/{courseId}:
 *   get:
 *     summary: Get all prerequisites for a specific course
 *     tags: [Prerequisites]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of course prerequisites
 *       400:
 *         description: Bad request
 */

