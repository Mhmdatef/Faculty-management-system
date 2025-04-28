const registerdCourses = require('../models/registerCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const { getExistStudent } = require('./student-controller');

exports.addCourse = async (req, res) => {
    try {
        const { student } = req.body;
        console.log(student);
        
        // تحقق من وجود الطالب في قاعدة البيانات
        let exist_student = await getExistStudent(student);
        
        // إذا لم يكن الطالب موجودًا، ارجع بخطأ 404
        if (!exist_student) {
            return res.status(404).json({
                status: 'fail',
                message: "Student not found"
            });
        }

        // إضافة الدورة إلى قاعدة البيانات
        const newCourse = await registerdCourses.create(req.body);

        // إضافة الدورة الجديدة إلى قائمة الدورات المسجلة الخاصة بالطالب
        exist_student.registerdCourses.push(newCourse._id);  // تأكد من إضافة ObjectId فقط

        // حفظ التعديلات على الطالب
        await exist_student.save();

        // إرجاع استجابة ناجحة
        res.status(201).json({
            status: 'success',
            data: { course: newCourse }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        // تنفيذ ميزات API مثل التصفية، التحديد، التصفية، والتحديد
        const features = new APIFeatures(registerdCourses.find(), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        
        // استرجاع الدورات المسجلة
        const registerdCourses = await features.query;

        res.status(200).json({
            status: 'success',
            results: registerdCourses.length,
            data: { registerdCourses }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
