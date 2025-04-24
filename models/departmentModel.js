const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        trim: true,
        unique: true
    },
    headOfDepartment: {
        type: String,
        required: [true, 'Department head is required'],

    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
