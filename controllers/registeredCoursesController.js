const RegisteredCourse = require('../models/registerCourseModel');
const registeredCourses = require('../models/registerCourseModel');
const Student = require('../models/studentModel');
const completedCourse = require('../models/completedCourseModel'); 
const APIFeatures = require('../utils/apiFeatures');
const { getExistStudent } = require('./student-controller');

exports.addCourse = async (req, res) => {
  try {
    const { student, courses } = req.body;

    if (!student || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both student and courses array are required.'
      });
    }

    // التحقق من أن الطالب موجود
    const exist_student = await Student.findById(student);
    if (!exist_student) {
      return res.status(404).json({
        status: 'fail',
        message: "Student not found"
      });
    }

    // التحقق من عدم تكرار أي كورس مسجل مسبقًا
    const alreadyRegistered = await RegisteredCourse.findOne({
      student: student,
      courses: { $elemMatch: { $in: courses } }
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        status: 'fail',
        message: 'One or more courses are already registered for this student.'
      });
    }

    const completedCourses = await completedCourse.find({
      student: student,
      course: { $in: courses }
    });

    if (completedCourses.length > 0) {
      const completedCourseIds = completedCourses.map(cc => cc.course.toString());
      return res.status(400).json({
        status: 'fail',
        message: `Cannot register courses that are already completed. Completed course IDs: ${completedCourseIds.join(', ')}`
      });
    }

    const newRegistered = await RegisteredCourse.create({
      student,
      courses
    });

    // حفظ الـ id في student إذا كنت عامل ref من ناحيتهم
    // exist_student.registeredCourses.push(newRegistered._id);
    // await exist_student.save();  // لو فعلاً عندك field كده في student

    res.status(201).json({
      status: 'success',
      data: { registered: newRegistered }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

const mongoose = require('mongoose');

exports.deleteRegisteredCourseByStudentAndCourse = async (studentId, courseId) => {
    try {
        // Validate inputs
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            throw new Error('Invalid student ID');
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new Error('Invalid course ID');
        }

        let exist_student = await getExistStudent(studentId);
        if (!exist_student) {
            throw new Error('Student not found');
        }

        // Convert to ObjectIds for consistent comparison
        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Find ALL registration documents that contain this course for this student
        const registrationDocs = await registeredCourses.find({
            student: studentObjectId,
            courses: courseObjectId
        });

        if (!registrationDocs || registrationDocs.length === 0) {
            console.warn(`No registered course found for student ${studentId} and course ${courseId}`);
            return false; // Not an error, just not found
        }

        // Process each registration document that contains this course
        for (const registrationDoc of registrationDocs) {
            // If this is the only course in the registration, delete the entire document
            if (registrationDoc.courses.length === 1) {
                await registeredCourses.findByIdAndDelete(registrationDoc._id);
                exist_student.registeredCourses.pull(registrationDoc._id);
                console.log(`Deleted entire registration document ${registrationDoc._id}`);
            } else {
                // If there are multiple courses, just remove this specific course from the array
                await registeredCourses.findByIdAndUpdate(
                    registrationDoc._id,
                    { $pull: { courses: courseObjectId } },
                    { new: true }
                );
                console.log(`Removed course ${courseId} from registration document ${registrationDoc._id}`);
            }
        }

        await exist_student.save();
        return true;
    } catch (err) {
        console.error('Error deleting registered course:', err.message);
        throw err;
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const features = new APIFeatures(registeredCourses.find(), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();

        const registeredCoursesList = await features.query;

        res.status(200).json({
            status: 'success',
            results: registeredCoursesList.length,
            data: { registeredCourses: registeredCoursesList }
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
        const course = await registeredCourses.findById(req.params.id);
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
        const course = await registeredCourses.findByIdAndUpdate(req.params.id, req.body, {
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

exports.deleteregisterdCourse = async (req, res) => {
    try {
        const course = await registeredCourses.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({
                status: 'fail',
                message: 'No registered course found with that ID'
            });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};