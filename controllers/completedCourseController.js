const completedCourse = require('../models/completedCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const {getExistStudent} = require('./student-controller')

exports.addcompletedCourse = async (req, res) => {
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

        const newcompletedCourse = await completedCourse.create(req.body);

        // Push course ID to student's completedCourses
        exist_student.completedCourses.push(newcompletedCourse._id);
        await exist_student.save(); // احفظ التعديل

        res.status(201).json({
            status: 'success',
            data: { completedCourse: newcompletedCourse }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


// exports.getAllcompletedCourse = async (req, res) => {
//     try {
//         const features = new APIFeatures(completedCourse.find(), req.query)
//             .filter()
//             .limitFields()
//             .paginate()
//             .sort();
//         const completedCourse = await features.query;

//         res.status(200).json({
//             status: 'success',
//             results: completedCourse.length,
//             data: { completedCourse }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };


