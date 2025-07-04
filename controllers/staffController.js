const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/create.token');
const Staff = require('../models/staffModel');
const APIFeatures = require('../utils/apiFeatures');
const appError = require('../utils/appError');
const sendEmail = require('../utils/Email');

exports.addStaff = async (req, res) => {
    try {
        const newStaff = await Staff.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { newStaff }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        const features = new APIFeatures(Staff.find(), req.query).filter().sort().paginate().limitFields();
        const staff = await features.query;
        res.status(200).json({
            status: 'success',
            data: { staff }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getOneStaffByID = async (req, res) => {
    try {
        const features = new APIFeatures(Staff.findById(req.params.id), req.query).limitFields();
        const staff = await features.query;

        if (!staff) {
            return res.status(404).json({ status: "fail", message: "Staff member not found" });
        }

        res.status(200).json({
            status: 'success',
            data: { staff }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: { updatedStaff } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const staff = await Staff.findOne({ email: req.body.email });
        if (!staff) {
            return next(new appError('There is no staff with that email address', 404));
        }

        // Generate a reset token
        const resetToken = staff.createPasswordResetToken();
        await staff.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

        await sendEmail({
            email: staff.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        if (staff) {
            staff.passwordResetToken = undefined;
            staff.passwordResetExpires = undefined;
            await staff.save({ validateBeforeSave: false });
        }
        console.error('Error sending email: ', err);
        res.status(500).json({ message: 'There was an error sending the email.', error: err.message });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const staff = await Staff.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!staff) {
            return next(new appError('Token is invalid or has expired', 400));
        }

        staff.password = req.body.password;
        staff.passwordConfirm = req.body.passwordConfirm;
        staff.passwordResetToken = undefined;
        staff.passwordResetExpires = undefined;
        await staff.save();

        const token = await createToken(staff, 200, res);

        res.status(200).json({
            status: 'success',
            message: 'Password reset successful',
            token: token,
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updatePassword = async (request, response, next) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = request.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return response.status(400).json({ message: "Please provide all required fields" });
        }

        if (newPassword !== confirmNewPassword) {
            return response.status(400).json({ message: "Passwords do not match" });
        }

        const staff = await Staff.findById(request.staff._id).select('+password');

        if (!staff) {
            return response.status(404).json({ message: "Staff not found" });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, staff.password);
        if (!isCurrentPasswordCorrect) {
            return next(new appError("Current password is incorrect", 401));
        }

        staff.password = newPassword;
        staff.passwordConfirm = confirmNewPassword;
        await staff.save();

        await createToken(staff, 200, response);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};
