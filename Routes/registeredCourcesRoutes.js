const express = require('express');
const {getAllCourses, addCourse} = require('../controllers/registeredCoursesController')
const router = express.Router();

router
    .route('/')
    .post(addCourse)
    .get(getAllCourses);

module.exports = router;
