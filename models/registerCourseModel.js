const mongoose = require('mongoose');
const { Schema } = mongoose;

const registeredCourseSchema = new mongoose.Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      }
    ]
  },
  { timestamps: true }
);

const RegisteredCourse = mongoose.model('RegisteredCourse', registeredCourseSchema);
module.exports = RegisteredCourse;
