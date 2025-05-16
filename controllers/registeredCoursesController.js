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
exports.getregisterdCourse = async (req, res) => {
    try {
        const course = await registerdCourses.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'fail',
                message: 'No course found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { course }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
exports.updateregisterdCourse = async (req, res) => {
    try {
        const course = await registerdCourses.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return res.status(404).json({
                status: 'fail',
                message: 'No course found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { course }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteRegisteredCourseByStudentAndCourse = async (studentId, courseId) => {
  try {
    await registerdCourses.findOneAndDelete({ student: studentId, course: courseId });
  } catch (err) {
    console.error(`Error deleting registered course for student ${studentId}, course ${courseId}:`, err.message);
  }
};

// الدالة الأصلية لو كنت بتستخدمها في الراوت
exports.deleteregisterdCourse = async (req, res) => {
  try {
    const course = await registerdCourses.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        status: 'fail',
        message: 'No registerdcourse found with that ID'
      });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
/*


i will add new table in the database called remindercourses and when i add new completed course i should remove it from the registerdcourse table and register it in the registerdCourses table
i should add new api to recommend the courses to the student depending on the prerequisites courses and this semester

*/