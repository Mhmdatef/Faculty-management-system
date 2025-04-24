const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();


// مسار تسجيل الدخول (Login)
router
    .route('/login')
    .post(authController.log_in);

module.exports = router;
