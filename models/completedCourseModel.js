const mongoose = require('mongoose');
const {Schema} = require('mongoose')

const completedCourseSchema = new mongoose.Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref : 'Course',
        required: [true, 'Course is required']
    },
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        enum: ['A', 'B', 'C', 'D', 'F']
    },  
    student: {
        type: Schema.Types.ObjectId,
        ref : 'Student',
        required: [true, 'Student is required']
    },
completedDate: {
        type: Date,
        default: Date.now
    }
}
    
    , { timestamps: true });

    const CompletedCourse = mongoose.model('CompletedCourse', completedCourseSchema);
    module.exports = CompletedCourse;
    