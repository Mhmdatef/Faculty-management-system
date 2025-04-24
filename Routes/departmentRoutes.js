const express = require('express');
const departmentController = require('../controllers/departmentController');
const middleware = require('./../middleware/protect');
const router = express.Router();

router
    .route('/')
    .post(middleware.protect,middleware.restrictTo("student_affairs"),departmentController.addDepartment)
    .get(middleware.protect,middleware.restrictTo("student_affairs"),departmentController.getAllDepartments);

router
    .route('/:id')
    .get(middleware.protect,middleware.restrictTo("student_affairs"),departmentController.getOneDepartmentByID)
    .patch(middleware.protect,middleware.restrictTo("student_affairs"),departmentController.updateDepartment)
    .delete(middleware.protect,middleware.restrictTo("student_affairs"),departmentController.deleteDepartment);

module.exports = router;
