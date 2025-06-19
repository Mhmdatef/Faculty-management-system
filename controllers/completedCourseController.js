const completedCourse = require('../models/completedCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
const RegisteredCourse = require('../models/registerCourseModel'); // Add this import

const { deleteRegisteredCourseByStudentAndCourse } = require('./registeredCoursesController');
const { getExistStudent } = require('./student-controller');
const XLSX = require('xlsx');
const fs = require('fs');

exports.getAllCompletedCourses = async (req, res) => {
  try {
    const features = new APIFeatures(completedCourse.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const completedCourses = await features.query;

    res.status(200).json({
      status: 'success',
      results: completedCourses.length,
      data: { completedCourses }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.addcompletedCourse = async (req, res) => {
  try {
    const { student, course, grade } = req.body;

    // جلب بيانات الطالب
    let exist_student = await getExistStudent(student);
    if (!exist_student) {
      return res.status(404).json({
        status: 'fail',
        message: "Student not found"
      });
    }

    // التحقق إذا الطالب أنهى هذا المقرر من قبل
    const alreadyCompleted = await completedCourse.findOne({
      student: student,
      course: course
    });
    if (alreadyCompleted) {
      return res.status(400).json({
        status: 'fail',
        message: "Course already completed"
      });
    }

    // جلب بيانات المقرر
    const exist_course = await Course.findById(course);
    if (!exist_course) {
      return res.status(404).json({
        status: 'fail',
        message: "Course not found"
      });
    }

    // NEW: التحقق من أن الطالب مسجل في هذا المقرر
    const isRegistered = await RegisteredCourse.findOne({
      student: student,
      courses: course
    });
    
    if (!isRegistered) {
      return res.status(400).json({
        status: 'fail',
        message: "Student must be registered in this course before completing it"
      });
    }

    // إنشاء سجل المقرر المكتمل
    const newcompletedCourse = await completedCourse.create({
      student: exist_student._id,
      course: exist_course._id,
      grade
    });

    // إضافة المقرر المكتمل للطالب
    exist_student.completedCourses.push(newcompletedCourse._id);

    // تحديث الساعات المكتملة والمتبقية فقط إذا الدرجة ليست F
    if (grade !== 'F') {
      exist_student.totalCreditsCompleted += exist_course.creditHours;
      exist_student.reminderCredits -= exist_course.creditHours;
    }

    await exist_student.save();

    // حذف المقرر من جدول المسجلين لهذا الطالب (لو موجود)
    await deleteRegisteredCourseByStudentAndCourse(exist_student._id, exist_course._id);

    res.status(201).json({
      status: 'success',
      data: { completedCourse: newcompletedCourse }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.importCompletedCoursesFromExcel = async (req, res) => {
  let file;
  try {
    file = req.file;

    if (!file) {
      return res.status(400).json({ status: 'fail', message: 'Please upload a file' });
    }

    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ status: 'fail', message: 'Excel sheet is empty' });
    }

    const sheetHeaders = Object.keys(data[0]);
    const requiredFields = ['studentName', 'courseName', 'grade'];
    const missingFields = requiredFields.filter(field => !sheetHeaders.includes(field));
    if (missingFields.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const allowedGrades = ['A', 'B', 'C', 'D', 'F'];
    const invalidGrades = data.filter(row => !allowedGrades.includes(row.grade));
    if (invalidGrades.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        status: 'fail',
        message: `Invalid grades found: ${invalidGrades.map(r => r.grade).join(', ')}`
      });
    }

    const createdCourses = [];
    const errors = [];

    for (const row of data) {
      const { studentName, courseName, grade } = row;

      const student = await Student.findOne({ name: studentName });
      const course = await Course.findOne({ name: courseName });

      if (!student || !course) {
        errors.push(`Missing: ${!student ? 'Student' : ''} ${!course ? 'Course' : ''} => ${studentName}, ${courseName}`);
        continue;
      }

      const alreadyCompleted = await completedCourse.findOne({
        student: student._id,
        course: course._id
      });
      if (alreadyCompleted) {
        errors.push(`Course already completed by student: ${studentName} - ${courseName}`);
        continue;
      }

      const isRegistered = await RegisteredCourse.findOne({
        student: student._id,
        courses: course._id
      });
      
      if (!isRegistered) {
        errors.push(`Student ${studentName} is not registered in course ${courseName}`);
        continue;
      }

      if (grade !== 'F') {
        student.totalCreditsCompleted += course.creditHours;
        student.reminderCredits -= course.creditHours;
        await student.save();
      }

      const newCompletedCourse = await completedCourse.create({
        student: student._id,
        course: course._id,
        grade
      });

      await Student.updateOne(
        { _id: student._id },
        { $push: { completedCourses: newCompletedCourse._id } }
      );

      await deleteRegisteredCourseByStudentAndCourse(student._id, course._id);

      createdCourses.push(newCompletedCourse);
    }

    fs.unlinkSync(file.path);
    
    res.status(201).json({
      status: 'success',
      message: 'Completed courses imported successfully',
      count: createdCourses.length,
      errors: errors.length > 0 ? errors : undefined,
      data: { completedCourses: createdCourses }
    });

  } catch (err) {
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};