const registerdCourses = require('../models/registerCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const {getExistStudent} = require('./student-controller')

exports.addCourse = async (req, res) => {
    try {
        const {student} = req.body
        console.log(student);
        
        let exist_student = await getExistStudent(student)

        console.log('student: ', exist_student);
        
        // if(!exist_student){
        //     res.status(404).json({
        //         status : 'fail',
        //         message : "student not found"
        //     })
        // }

        const newCourse = await registerdCourses.create(req.body);

        exist_student.registerdCourses.push(newCourse)

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

exports.getAllCourses = async (req, res) => {
    try {
        const features = new APIFeatures(registerdCourses.find(), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        const registerdCourses = await features.query;

        res.status(200).json({
            status: 'success',
            results: registerdCourses.length,
            data: { registerdCourses     }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


