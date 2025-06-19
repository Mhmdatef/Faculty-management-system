const staffDb = require('../models/staffModel');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { Promise } = require('mongoose');

exports.protect = catchAsync(async (request, response, next) => {
    let token;
    
    // 1) Extract token from authorization header
    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        token = request.headers.authorization.split(' ')[1];
    }
    console.log(token);
    // If no token found, return authentication error
    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }

    // 2) Verify token validity using secret key
    const token_data = await (jwt.verify)(token, process.env.SECRET);
    console.log(token_data);

    // 3) Check if staff member still exists in database
    const staff = await staffDb.findById(token_data.id);
    if (!staff) {
        return next(new AppError('The staff member associated with this token no longer exists', 401));
    }

    // // 4) Verify if password was changed after token was issued
   if (staff.changedPasswordAfter(token_data.iat)) {
        return next(new AppError('Password was recently changed. Please log in again', 401));
     }

    // 5) Attach staff data to request object (without password)
    staff.password = undefined;
    request.staff = staff;
    
    // Proceed to next middleware
    next();
});
exports.restrictTo = (...roles) => {
    return (request, response, next) => {
        // Check if staff role is included in the allowed roles
        if (!roles.includes(request.staff.role)) {
            // return next(new AppError('You do not have permission to perform this action', 403));
        }
        // Proceed to next middleware
        next();
    };
}