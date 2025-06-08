const Department = require('../models/departmentModel');
const APIFeatures = require('../utils/apiFeatures');

// ✅ إضافة قسم جديد
exports.addDepartment = async (req, res) => {
    try {
        const newDepartment = await Department.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { department: newDepartment }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ✅ جلب جميع الأقسام
exports.getAllDepartments = async (req, res) => {
    try {
        const features = new APIFeatures(Department.find().populate('courses'), req.query)
            .filter()
            .sort()
            .paginate()
            .limitFields();
        const departments = await features.query;

        res.status(200).json({
            status: 'success',
            results: departments.length,
            data: { departments }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.getOneDepartmentByID = async (req, res) => {
    try {
        const features = new APIFeatures(Department.findById(req.params.id).populate('courses'), req.query)
            .limitFields();
        const department = await features.query;

        if (!department) {
            return res.status(404).json({ status: "fail", message: "Department not found" });
        }

        res.status(200).json({
            status: 'success',
            data: { department }
        });

    } catch (err) {
        res.status(400).json({ status: 'fail', message: 'Invalid Department ID' });
    }
};


// ✅ تحديث بيانات القسم
exports.updateDepartment = async (req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedDepartment) {
            return res.status(404).json({ status: 'fail', message: 'Department not found' });
        }

        res.status(200).json({ status: 'success', data: { department: updatedDepartment } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ✅ حذف قسم
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ status: 'fail', message: 'Department not found' });
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
