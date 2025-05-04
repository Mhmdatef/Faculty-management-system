const Student = require('../models/studentModel');
const APIFeatures = require('./../utils/apiFeatures');
const bcrypt = require('bcryptjs');  // استيراد مكتبة bcrypt
const createToken = require('./../utils/create.token');
const XLSX = require('xlsx');
const fs = require('fs');
exports.addOneStudent = async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        return res.status(201).json({
            status: 'success',
            data: { student: newStudent }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const features = new APIFeatures(Student.find(), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        const students = await features.query
        .populate("completedCourses")
        .populate("registerdCourses")
        .populate("activities"); // تأكد من استخدام populate هنا
        
        return res.status(200).json({
            status: 'success',
            data: { students }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateOneStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedStudent) {
            return res.status(404).json({ status: "fail", message: "Student not found" });
        }

        return res.status(200).json({
            status: 'success',
            data: { student: updatedStudent }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteOneStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ status: "fail", message: "Student not found" });
        }

        return res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getOneStudentByID = async (req, res) => {
    try {
        const { id } = req.params;
        let { fields } = req.query;

        let query = Student.findById(id).populate([
            { path: 'registerdCourses' },
            { path: 'completedCourses' },
            { path: 'activities' }
        ]);

        if (fields) {
            // تنظيف الحقول
            const selectedFields = fields.split(',').map(f => f.trim()).join(' ');
            query = query.select(selectedFields);
        }

        const student = await query;

        if (!student) {
            return res.status(404).json({
                status: "fail",
                message: "Student not found"
            });
        }

        return res.status(200).json({
            status: 'success',
            data: { student }
        });

    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getExistStudent = async (studentId) => {
    try {
        const student  = await Student.findById(studentId)

        return student
        
    } catch (error) {
        console.log(error);
        
        
    }
};
exports.log_in = async (request, response, next) => {
    console.log(request.body);

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).send("Un-authenticated");

    // البحث عن الطالب في قاعدة البيانات باستخدام البريد الإلكتروني
    const student = await Student.findOne({ email }).select('+password'); // تأكد من أنك تسترجع كلمة السر

    if (!student) {
        return response.status(400).send("Student not found");
    }

    // تحقق من كلمة السر باستخدام bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, student.password);

    if (!isPasswordCorrect) {
        return response.status(400).send("Invalid credentials");
    }

    // إذا كانت كلمة السر صحيحة، قم بإنشاء التوكن
    await createToken(student, 200, response);
};
exports.importStudentsFromExcel = async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ status: 'fail', message: 'Please upload a file' });
      }
  
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      const data = XLSX.utils.sheet_to_json(sheet);
  
      // إنشاء الطلاب وتخزين النتيجة
      const createdStudents = await Student.insertMany(data);
  
      // حذف الملف بعد المعالجة
      fs.unlinkSync(file.path);
  
      res.status(201).json({
        status: 'success',
        message: 'Students imported successfully',
        count: createdStudents.length,
        data: {
          students: createdStudents,
        },
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: err.message });
    }
  };
  