const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');

exports.addCourse = async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
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
        const features = new APIFeatures(Course.find(), req.query)
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
        let query = Course.findById(req.params.id);
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
