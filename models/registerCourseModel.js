const mongoose=require('mongoose')
const {Schema}=require('mongoose')
const registeredCourseSchema = new mongoose.Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref : 'Student'
    },
   courses :{
    type: Schema.Types.ObjectId,
    ref:'Course',
}
}

,    { timestamps: true }
)
const RegisteredCourse = mongoose.model('RegisteredCourse', registeredCourseSchema);
module.exports = RegisteredCourse;
