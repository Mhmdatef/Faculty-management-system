const mongoose = require('mongoose');
const validate = require('validator');
const bycrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Staff must have a name']
    },
    email: {
        type: String,
        required: [true, 'Staff must have an email'],
        unique: true
    },
    universityEmail: {
        type: String,
        required: [true, 'Staff must have a university email'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Staff must have a phone number'],
        unique: true
    },
    role: {
        type: String,
        enum: ['control', 'student_affairs', 'activity_staff'],
        required: [true, 'Staff must have a role']
    },
   
    password: {
        type: String,
        required: [true, 'Staff must have a password'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Staff must confirm the password']
        ,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
}, { timestamps: true });
staffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password =await bycrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // remove passwordConfirm from the database
    next();
})
staffSchema.methods.correctPassword = async function (candidatePassword, staffPassword) {
    return await bycrypt.compare(candidatePassword, staffPassword);
};
staffSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChanged) {
        const changedTimestamp = parseInt(this.passwordChanged.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false; // false means not changed
};
const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
