const mongoose=require('mongoose')
const {Schema}=require('mongoose')
const prerequisiteSchema = new mongoose.Schema({
  
   courses :[{
    type: Schema.Types.ObjectId,
    ref:'Course'
}] 
    
}
,    { timestamps: true }
)
const prerequisite = mongoose.model('prerequisite', prerequisiteSchema);
module.exports = prerequisite;
