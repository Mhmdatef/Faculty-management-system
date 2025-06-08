const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');
const Department = require('../models/departmentModel');

exports.addCourse = async (req, res) => {
  try {
    const { name , code , department, prerequisite } = req.body;

 

    // التأكد من وجود القسم
    const existDepartment = await Department.findById(department);
    if (!existDepartment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Department not found'
      });
    }

    // التأكد من وجود كل الـ prerequisites (لو موجودين)
    if (prerequisite && prerequisite.length > 0) {
      const countPrerequisites = await Course.countDocuments({ _id: { $in: prerequisite } });
      if (countPrerequisites !== prerequisite.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'One or more prerequisite courses not found'
        });
      }
    }

    // التأكد من عدم وجود كورس بنفس الاسم أو الكود
    const existingCourse = await Course.findOne({
      $or: [
        { name: name.trim() },
        { code: code.toUpperCase() }    
      ]
    });

    if (existingCourse) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course with the same name or code already exists'
      });
    }

    // إنشاء الكورس الجديد
    const newCourse = await Course.create(req.body);
    // إضافة الكورس للقسم
    existDepartment.courses.push(newCourse._id);
    await existDepartment.save();

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
        const features = new APIFeatures(Course.find().populate('prerequisite'), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        const courses = await features.query;

        res.status(200).json({
            status: 'success',
            results: courses.length,
            data: { courses }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        let query = Course.findById(req.params.id).populate('prerequisites');
        const features = new APIFeatures(query, req.query).limitFields();
        const course = await features.query;

        if (!course) {
            return res.status(404).json({ status: 'fail', message: 'Course not found' });
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

exports.updateCourse = async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedCourse) {
            return res.status(404).json({ status: 'fail', message: 'Course not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { course: updatedCourse }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({ status: 'fail', message: 'Course not found' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getCourseByName = async (req, res) => {
    const { name } = req.params;

    try {
        const course = await Course.findOne({ name }).populate('prerequisites');

        if (!course) {
            return res.status(404).json({
                status: 'fail',
                message: 'Course not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { course }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};
