const mongoose=require('mongoose')
const {Schema}=require('mongoose')
const recommendedCourseSchema = new mongoose.Schema({
  
   courses :[{
    type: Schema.Types.ObjectId,
    ref:'Course'
}] 
    ,
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}
,    { timestamps: true }
)
const recommendedCourses = mongoose.model('recommendedCourses', recommendedCourseSchema);
module.exports = recommendedCourse;
