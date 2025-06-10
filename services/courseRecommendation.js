const Course = require('../models/courseModel');
const Student = require('../models/studentModel')
;exports.getRecommendedCourses = async (studentId, currentTerm) => {
  try {
    const student = await Student.findById(studentId)
      .populate({
        path: 'completedCourses.course',
        select: '_id' // نختار فقط الحقل الذي نحتاجه
      })
      .populate('department');

    if (!student) throw new Error('Student not found');
    if (!student.department) throw new Error('Student department not found');

    // معالجة آمنة للمقررات المكتملة
    const completedCourseIds = (student.completedCourses || [])
      .filter(completed => completed?.course?._id) // تأكد من وجود course و _id
      .map(completed => completed.course._id.toString());

    // جلب مقررات القسم للفصل الحالي
    const departmentCourses = await Course.find({
      department: student.department._id,
      term: currentTerm
    }).populate('prerequisite');

    // تصفية المقررات المقترحة
    const recommendedCourses = departmentCourses.filter(course => {
      if (!course.prerequisite || course.prerequisite.length === 0) return true;

      return course.prerequisite.every(prereq => 
        prereq?._id && completedCourseIds.includes(prereq._id.toString())
      );
    });

    return recommendedCourses;
  } catch (err) {
    console.error('Error in getRecommendedCourses:', err);
    throw err; // إعادة إلقاء الخطأ للتعامل معه في الطبقة الأعلى
  }
};