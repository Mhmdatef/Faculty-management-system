const express=require('express')
const protect = require('./../middleware/protect')
const studentController= require('../controllers/student-controller');
const router = express.Router();
router.route('/')
                .post(studentController.addOneStudent)
                .get(studentController.getAllStudents)
router.route('/:id')
                  .patch(studentController.updateOneStudent)    
                  .delete(studentController.deleteOneStudent)  
                  .get(studentController.getOneStudentByID) 
router.route('/login')
                  .post(studentController.log_in) // تسجيل دخول الطالب                  
  
module.exports = router;
