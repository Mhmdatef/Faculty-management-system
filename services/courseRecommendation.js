const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

exports.getRecommendedCourses = async (studentId, currentTerm) => {
  const student = await Student.findById(studentId)
    .populate('completedCourses')
    .populate('department');

  if (!student) throw new Error('Student not found');
  if (!student.department) throw new Error('Student department not found');

  const completedCourseIds = (student.completedCourses || [])
    .map(c => (c._id ? c._id.toString() : null))
    .filter(id => id !== null);

  // جلب كورسات القسم للتيرم الحالي
  const departmentCourses = await Course.find({
    department: student.department._id,
    term: currentTerm
  }).populate('prerequisite');

  // تصفية الكورسات بناء على البرسيكونسيس
  const recommendedCourses = departmentCourses.filter(course => {
    if (!course.prerequisite || course.prerequisite.length === 0) return true;

    return course.prerequisite.every(prereq =>
      completedCourseIds.includes(prereq._id ? prereq._id.toString() : '')
    );
  });

  return recommendedCourses;
};
