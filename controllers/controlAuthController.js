const Staff = require('../models/staffModel');
const bcrypt = require('bcryptjs');  
const { createToken } = require('../utils/create.token');
const AppError = require('../utils/appError');

exports.log_in = async (request, response, next) => {
    console.log(request.body);

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).send("Please provide email and password");

    const staff = await Staff.findOne({ email }).select('+password');

    if (!staff) {
        return response.status(400).send("Staff not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, staff.password);

    if (!isPasswordCorrect) {
        return response.status(400).send("Invalid credentials");
    }

    // ✅ مسموح فقط للي role = "control"
    if (staff.role !== 'control') {
        return response.status(403).send("Access denied: Unauthorized staff role");
    }

    await createToken(staff, 200, response);
};
// exports.forgot_password =  async(request, response, next) => {
//     const staff = await Staff.findOne({ email: request.body.email });
//     if (!staff) {
//         return next(new AppError("Staff not found with this email", 404));
//     }
//     const resetToken = staff.createPasswordResetToken();
//     await staff.save(  { validateBeforeSave: false });

// } 

exports.updatePassword = async (request, response, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = request.body;
// Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return response.status(400).send("Please provide all required fields");
    }
// Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
        return response.status(400).send("Passwords do not match");
    }
// Find the staff member by ID and include the password field
    const staff = await Staff.findById(request.staff._id).select('+password');

    if (!staff) {
        return response.status(404).send("Staff not found");
    }
// Check if the current password is correct
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, staff.password);
    if (!isCurrentPasswordCorrect) {
        return new AppError("Current password is incorrect", 401);
    }

    //update password
    staff.password = newPassword;
    staff.passwordConfirm = confirmNewPassword;
    await staff.save();
//
    await createToken(staff, 200, response);
};