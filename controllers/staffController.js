const { token } = require('morgan');
const Staff = require('../models/staffModel');
const APIFeatures = require('../utils/apiFeatures');
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
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
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
