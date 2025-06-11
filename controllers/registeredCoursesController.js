const registeredCourses = require('../models/registerCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const { getExistStudent } = require('./student-controller');
const Course = require('../models/courseModel');
exports.addCourse = async (req, res) => {
    try {
        const { student, courses } = req.body;  // جلب student و course

        if (!student || !courses) {
            return res.status(400).json({
                status: 'fail',
                message: 'student and course fields are required'
            });
        }
        const courseExists = await Course.findOne({ _id: { $in: courses } });
if (!courseExists) {
    return res.status(404).json({
        status: 'fail',
        message: 'One or more courses do not exist'
    });
}

        let exist_student = await getExistStudent(student);

        if (!exist_student) {
            return res.status(404).json({
                status: 'fail',
                message: "Student not found"
            });
        }

        const alreadyRegistered = await registeredCourses.findOne({
            student: student,
            courses: courses
        });

        if (alreadyRegistered) {
            return res.status(400).json({
                status: 'fail',
                message: 'Course already registered'
            });
        }

        const newCourse = await registeredCourses.create(req.body);

        exist_student.registeredCourses.push(newCourse._id);
        await exist_student.save();

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


exports.deleteRegisteredCourseByStudentAndCourse = async (studentId, courseId) => {
    try {
        let exist_student = await getExistStudent(studentId);
        if (!exist_student) {
            throw new Error('Student not found');
        }

        const deletedCourse = await registeredCourses.findOneAndDelete({
            student: studentId,
            courses: courseId
        });

        if (!deletedCourse) {
            throw new Error('No registered course found with that student and course');
        }

        exist_student.registeredCourses.pull(deletedCourse._id);
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
