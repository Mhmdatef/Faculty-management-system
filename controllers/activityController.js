const Activity = require('../models/activityModel');
const APIFeatures = require('../utils/apiFeatures');
const {getExistStudent} = require('./student-controller')


exports.addActivity = async (req, res) => {
    try {
        const { student } = req.body;
        console.log(student);

        let exist_student = await getExistStudent(student);
        console.log('student: ', exist_student);

        if (!exist_student) {
            return res.status(404).json({
                status: 'fail',
                message: "Student not found"
            });
        }

        const newActivity = await Activity.create(req.body);

        // Push course ID to student's completedCourses
        exist_student.activities.push(newActivity._id);
        await exist_student.save(); // احفظ التعديل

        res.status(201).json({
            status: 'success',
            data: { Activity: newActivity }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllActivities = async (req, res) => {
    try {
        const features = new APIFeatures(Activity.find(), req.query).filter().sort().paginate().limitFields();
        const activities = await features.query;
        res.status(200).json({
            status: 'success',
            data: { activities }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getOneActivityByID = async (req, res) => {
    try {
        const features = new APIFeatures(Activity.findById(req.params.id), req.query).limitFields();
        const activity = await features.query;

        if (!activity) {
            return res.status(404).json({ status: "fail", message: "Activity not found" });
        }
        
        res.status(200).json({
            status: 'success',
            data: { activity }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateActivity = async (req, res) => {
    console.log(req.params.id, req.body);
    
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: { updatedActivity } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

