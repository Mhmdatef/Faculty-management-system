const mongoose = require('mongoose');
const {Schema} = require('mongoose')
const bycrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '❌ Student must have a name'],
      trim: true,
      minlength: [3, '❌ Name must be at least 3 characters long'],
      maxlength: [50, '❌ Name must be less than 50 characters'],
    },
    level: {
      type: Number,
      required: [true, '❌ Level is required'],
      min: [1, '❌ Level cannot be less than 1'],
      max: [4, '❌ Level cannot be more than 4'],
    },
    studentID: {
      type: Number,
      required: [true, '❌ Student must have an ID'],
      unique: true,
      trim: true,
    }, 
    totalCreditsCompleted: {
      type: Number,
      default: 0,
      min: [0, '❌ Total completed credits must be at least 0'],
      max: [144, '❌ Total completed credits cannot exceed 144']
    },
    email: {
      type: String,
      required: [true, '❌ Student must have an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, '❌ Please provide a valid email address'],
    }
    ,
    password: {
      type: String,
      required: [true, '❌ Password is required'],
      minlength: [8, '❌ Password must be at least 8 characters long'],
      select: false, // ❌ لا تظهر كلمة المرور عند استرجاع البيانات
    }
    ,
    passwordConfirm: {
      type: String,
      required: function () {
        return this.isNew || this.isModified('password');
      },
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: '❌ Passwords do not match!',
      },
    },
    
    phone: {
      type: String,
      required: [true, '❌ Phone number is required'],
      match: [/^01[0-9]{9}$/, '❌ Phone number must be a valid Egyptian number'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, '❌ Date of birth is required'],
    },
    gender: {
      type: String,
      required: [true, '❌ Gender is required'],
      enum: {
        values: ['Male', 'Female'],
        message: '❌ Gender must be either Male or Female',
      },
    },
    department: {
     type : Schema.Types.ObjectId,
     ref : 'Department'
    },
    registeredCourses: [{
      type: Schema.Types.ObjectId,
      ref: "RegisteredCourse",
      required : false
      ,
    }],
    GPA: {
      type: Number,
      min: [0, '❌ GPA cannot be less than 0'],
      max: [4, '❌ GPA cannot be more than 4'],
      default: 0,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    completedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CompletedCourse',
      }
    ]
    ,   
     activities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
      }
    ],
    reminderCredits:{
      type: Number,
      default: 144,
      min: [0, '❌ Reminder credits cannot be less than 0'],
      max: [144, '❌ Reminder credits cannot exceed 144']
    },

  },
  
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}

  
  
);
studentSchema.pre(/^find/,async function (next) {
this.populate({
path: 'department',
select: 'name -_id' // Exclude _id field from the populated department
}).populate(
{
path: 'activities',
select: 'type description -_id', // Exclude _id field from the populated registeredCourses
})
next();
})


studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password =await bycrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // remove passwordConfirm from the database
    next();
})
studentSchema.methods.correctPassword = async function (candidatePassword, studentPassword) {
    return await bycrypt.compare(candidatePassword, studentPassword);
};
studentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChanged) {
        const changedTimestamp = parseInt(this.passwordChanged.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false; // false means not changed
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;


