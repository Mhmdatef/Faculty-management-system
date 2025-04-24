const express = require('express');
const completedCourseController = require('../controllers/completedCourseController');
const middleware = require('./../middleware/protect');
const router = express.Router();
    router
    .route('/')
    .post(completedCourseController.addcompletedCourse)
    .get(completedCourseController.getAllcompletedCourse);
module.exports = router;
