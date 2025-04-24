const express = require('express');
const courseController = require('../controllers/courseController');
const middleware = require('./../middleware/protect');
const router = express.Router();

router
    .route('/')
    .post(middleware.protect,middleware.restrictTo("student_affairs"),courseController.addCourse) 
    .get(courseController.getAllCourses); 

router
    .route('/:id')
    .get(middleware.protect,middleware.restrictTo("student_affairs"),courseController.getCourseById)   
    .patch(middleware.protect,middleware.restrictTo("student_affairs"), courseController.updateCourse)  
    .delete(middleware.protect,middleware.restrictTo("student_affairs"),courseController.deleteCourse);   

module.exports = router;
