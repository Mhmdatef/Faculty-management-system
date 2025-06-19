const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');
const Department = require('../models/departmentModel');

exports.addCourse = async (req, res) => {
  try {
    let { name, code, department, prerequisite } = req.body;

    // توحيد الاسم والكود
    const normalizedName = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const normalizedCode = code.trim().toUpperCase();

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
        { name: { $regex: `^${normalizedName}$`, $options: 'i' } },
        { code: normalizedCode }
      ]
    });

    if (existingCourse) {
      return res.status(400).json({
        status: 'fail',
        message: 'Course with the same name or code already exists'
      });
    }

    // إنشاء الكورس الجديد بعد تعديل الاسم والكود
    const newCourse = await Course.create({
      ...req.body,
      name: normalizedName,
      code: normalizedCode
    });

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
exports.assignCourseToDepartment = async (req, res) => {
  try {
    const { courseId, departmentId } = req.body;

    // 1. تأكد أن الكورس والقسم موجودين
    const course = await Course.findById(courseId);
    const department = await Department.findById(departmentId);

    if (!course || !department) {
      return res.status(404).json({
        status: 'fail',
        message: 'Course or Department not found'
      });
    }

    // 2. تأكد إن القسم مش مكرر جوه الكورس
    if (!course.department.includes(department._id)) {
      course.department.push(department._id);
      await course.save();
    }

    // 3. تأكد إن الكورس مش مكرر جوه القسم
    if (!department.courses.includes(course._id)) {
      department.courses.push(course._id);
      await department.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Course assigned to department successfully'
    });

  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};