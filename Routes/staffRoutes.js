const express = require('express');
const staffController = require('../controllers/staffController.js');
const router = express.Router();


router.route('/')
    .post(staffController.addStaff) // إضافة موظف جديد
    .get(staffController.getAllStaff); // جلب كل الموظفين

router.route('/:id')
    .get(staffController.getOneStaffByID) // جلب موظف معين
    .patch(staffController.updateStaff) // تحديث بيانات الموظف
    .delete(staffController.deleteStaff); // حذف موظف




module.exports = router;
