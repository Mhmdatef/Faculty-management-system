    const mongoose = require('mongoose');
    const {Schema} = require('mongoose')
    const courseSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
            unique: true
        },
        code: {
            type: String,
            required: [true, 'Course code is required'],
            unique: true,
            uppercase: true
        },
        creditHours: {
            type: Number,
            required: [true, 'Credit hours are required'],
            min: [1, 'Credit hours must be at least 1']
        },
        term: {
            type: Number,
            required: [true, 'Term is required'],
            min: [1, 'Term must be at least 1']
        },
        department: [{
            type: Schema.Types.ObjectId,
            ref: 'Department',        
        }],
        prerequisite: [{
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: false
        }]
    }, { timestamps: true });


    const Course = mongoose.model('Course', courseSchema);
    module.exports = Course;
