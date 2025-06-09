const { getRecommendedCourses } = require('../services/courseRecommendation');
const Student = require('../models/studentModel');

exports.recommendCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { term } = req.body;

    if (!term) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current term is required'
      });
    }

    const recommended = await getRecommendedCourses(studentId, term);

    // تحديث الطالب بالكورسات المقترحة
    await Student.findByIdAndUpdate(studentId, {
      recomerndedCourseSchema: recommended.map(c => c._id)
    });

    res.status(200).json({
      status: 'success',
      data: { recommended }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
