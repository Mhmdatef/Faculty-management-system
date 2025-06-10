const { getRecommendedCourses } = require('../services/courseRecommendation');
const Student = require('../models/studentModel');

exports.recommendCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { term } = req.body;

    // التحقق من وجود الفصل الدراسي
    if (!term) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current term is required'
      });
    }

    // التحقق من وجود الطالب
    const studentExists = await Student.exists({ _id: studentId });
    if (!studentExists) {
      return res.status(404).json({
        status: 'fail',
        message: 'Student not found'
      });
    }

    // الحصول على المقررات المقترحة
    const recommended = await getRecommendedCourses(studentId, term);

    // تحديث الطالب بالكورسات المقترحة (مع التصحيح الإملائي)
    await Student.findByIdAndUpdate(studentId, {
      recommendedCourseSchema: recommended.map(c => c._id) // تم تصحيح الخطأ الإملائي هنا
    }, { new: true });

    // إرجاع بيانات مختصرة عن المقررات المقترحة
    const simplifiedCourses = recommended.map(course => ({
      _id: course._id,
      name: course.name,
      code: course.code,
      creditHours: course.creditHours
    }));

    res.status(200).json({
      status: 'success',
      results: recommended.length,
      data: { 
        courses: simplifiedCourses,
        studentId,
        term
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};