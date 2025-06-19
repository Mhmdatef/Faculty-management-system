const Prerequisite = require('../models/prerequisiteModel');
const Course = require('../models/courseModel');

exports.addPrerequisite = async (req, res) => {
  try {
    const { course, prerequisite } = req.body;

    if (!course || !prerequisite) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both course and prerequisite are required.'
      });
    }

    const exists = await Prerequisite.findOne({ course, prerequisite });

    if (exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'This prerequisite already exists for the course.'
      });
    }

    const newPrerequisite = await Prerequisite.create({ course, prerequisite });

    // ✅ أضف الـ prerequisite داخل كورس course
    await Course.findByIdAndUpdate(course, {
      $addToSet: { prerequisite: prerequisite }
    });

    res.status(201).json({
      status: 'success',
      data: { prerequisite: newPrerequisite }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


exports.getAllPrerequisites = async (req, res) => {
    try {
        const prerequisites = await Prerequisite.find()
            .populate('course', 'name code')
            .populate('prerequisite', 'name code');

        res.status(200).json({
            status: 'success',
            results: prerequisites.length,
            data: { prerequisites }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getCoursePrerequisites = async (req, res) => {
    try {
        const { courseId } = req.params;

        const coursePrereqs = await Prerequisite.find({ course: courseId })
            .populate('prerequisite', 'name code creditHours term');

        res.status(200).json({
            status: 'success',
            results: coursePrereqs.length,
            data: { prerequisites: coursePrereqs }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deletePrerequisite = async (req, res) => {
    try {
        const deleted = await Prerequisite.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ status: 'fail', message: 'Prerequisite not found' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
