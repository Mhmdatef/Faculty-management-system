const express = require('express');
const activityController = require('../controllers/activityController');
const middleware = require('./../middleware/protect');
const router = express.Router();

router.route('/')
    .post(activityController.addActivity)
    .get(middleware.protect,middleware.restrictTo("activity_staff"),activityController.getAllActivities);

router.route('/:id')
    .get(middleware.protect,middleware.restrictTo("activity_staff"),activityController.getOneActivityByID)
    .patch(middleware.protect,middleware.restrictTo("activity_staff"),activityController.updateActivity)
    .delete(middleware.protect,middleware.restrictTo("activity_staff"),activityController.deleteActivity);

module.exports = router;
