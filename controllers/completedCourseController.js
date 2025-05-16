const completedCourse = require('../models/completedCourseModel');
const APIFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
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
    const { student, course } = req.body;

    let exist_student = await getExistStudent(student);
    if (!exist_student) {
      return res.status(404).json({
        status: 'fail',
        message: "Student not found"
      });
    }

    const newcompletedCourse = await completedCourse.create(req.body);

    exist_student.completedCourses.push(newcompletedCourse._id);
    await exist_student.save();

    await deleteRegisteredCourseByStudentAndCourse(student, course);

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

    for (const row of data) {
      const { studentName, courseName, grade } = row;

      const student = await Student.findOne({ name: studentName });
      const course = await Course.findOne({ name: courseName });

      if (!student || !course) {
        console.warn(`Missing: ${!student ? 'Student' : ''} ${!course ? 'Course' : ''} => ${studentName}, ${courseName}`);
        continue;
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
      data: { completedCourses: createdCourses }
    });

  } catch (err) {
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
