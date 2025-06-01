const mongoose = require('mongoose');
const {Schema} = require('mongoose')

const activitySchema = new mongoose.Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref : 'Student'
    },
    description: {
        type: String,
        required: [true, 'Activity description is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Activity type is required'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
