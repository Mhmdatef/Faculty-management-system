const Student = require('../models/studentModel');
const Activities = require('../models/activityModel');
const RegisteredCourse = require('../models/registerCourseModel');
const CompletedCourse = require('../models/completedCourseModel');
const bcrypt = require('bcryptjs');
const { createToken } = require('./../utils/create.token');
const XLSX = require('xlsx');
const fs = require('fs');
const Course = require('../models/courseModel');

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

async function a(){
  const course = await Course.findById("68487f57968cd5107f023d88");
console.log(course);

}
a()

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().lean();

    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const completedCourses = await CompletedCourse.find({ student: student._id })
          .populate('course');

        const activities = await Activities.find({ student: student._id });

        const registeredCourses = await RegisteredCourse.find({ student: student._id })
          .populate('courses');

        const formattedCompleted = completedCourses.map(entry => ({
          courseName: entry.course ? entry.course.name : 'Unknown Course',
          grade: entry.grade,
          completedDate: entry.completedDate,
          courseId: entry.course ? entry.course._id : null,
          courseCode: entry.course ? entry.course.code : 'N/A'
        }));

        console.log(JSON.stringify(registeredCourses, null, 2));

        const formattedRegistered = registeredCourses.flatMap(entry =>
          (entry.courses || []).map(course => ({
            courseName: course?.name || 'Unknown Course',
            courseId: course?._id || null,
            courseCode: course?.code || 'N/A',
            creditHours: course?.creditHours || 0,
          }))
        );

        const formattedActivities = activities.map(activity => ({
          _id: activity._id,
          activityName: activity.name,
          description: activity.description,
          date: activity.date,
          type: activity.type
        }));

        return {
          ...student,
          completedCourses: formattedCompleted,
          registeredCourses: formattedRegistered,
          activities: formattedActivities
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        students: studentsWithDetails
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
exports.getOneStudentByID = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();

    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }

    const completedCourses = await CompletedCourse.find({ student: student._id })
      .populate('course');

    const registeredCourses = await RegisteredCourse.find({ student: student._id })
      .populate('courses');

    const activities = await Activities.find({ student: student._id });

    const formattedCompleted = completedCourses.map(entry => ({
      courseName: entry.course ? entry.course.name : 'Unknown Course',
      grade: entry.grade,
      completedDate: entry.completedDate,
      courseId: entry.course ? entry.course._id : null,
      courseCode: entry.course ? entry.course.code : 'N/A'
    }));

    const formattedRegistered = registeredCourses.flatMap(entry => {
      if (Array.isArray(entry.courses)) {
        return entry.courses.map(c => ({
          courseName: c.name,
          courseId: c._id,
          courseCode: c.code,
          creditHours: c.creditHours,
        }));
      } else if (entry.courses) {
        return [{
          courseName: entry.courses.name,
          courseId: entry.courses._id,
          courseCode: entry.courses.code,
          creditHours: entry.courses.creditHours,
        }];
      }
      return [];
    });

    const formattedActivities = activities.map(activity => ({
      activityName: activity.name,
      description: activity.description,
      date: activity.date,
      type: activity.type
    }));

    res.status(200).json({
      status: 'success',
      data: {
        ...student,
        completedCourses: formattedCompleted,
        registeredCourses: formattedRegistered,
        activities: formattedActivities
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};

// الدالة التي تقوم بإرجاع الطالب بناءً على الاسم
exports.getOneStudentByName = async (req, res) => {
  try {
    const { name } = req.params;

    const student = await Student.findOne({ name }).lean();
    if (!student) {
      return res.status(404).json({
        status: 'fail',
        message: `Student with name ${name} not found`
      });
    }

    const completedCourses = await CompletedCourse.find({ student: student._id })
      .populate('course');

    const registeredCourses = await RegisteredCourse.find({ student: student._id })
      .populate('courses');

    const activities = await Activities.find({ student: student._id });

    const formattedCompleted = completedCourses.map(entry => ({
      courseName: entry.course ? entry.course.name : 'Unknown Course',
      grade: entry.grade,
      completedDate: entry.completedDate,
      courseId: entry.course ? entry.course._id : null,
      courseCode: entry.course ? entry.course.code : 'N/A'
    }));

    const formattedRegistered = registeredCourses.flatMap(entry => {
      if (Array.isArray(entry.courses)) {
        return entry.courses.map(c => ({
          courseName: c.name,
          courseId: c._id,
          courseCode: c.code,
          creditHours: c.creditHours,
        }));
      } else if (entry.courses) {
        return [{
          courseName: entry.courses.name,
          courseId: entry.courses._id,
          courseCode: entry.courses.code,
          creditHours: entry.courses.creditHours,
        }];
      }
      return [];
    });

    const formattedActivities = activities.map(activity => ({
      activityName: activity.name,
      description: activity.description,
      date: activity.date,
      type: activity.type
    }));

    res.status(200).json({
      status: 'success',
      data: {
        ...student,
        completedCourses: formattedCompleted,
        registeredCourses: formattedRegistered,
        activities: formattedActivities
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
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

exports.getExistStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId)

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

  const student = await Student.findOne({ email }).select('+password'); 

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
      return res.status(400).json({ status: 'fail', message: 'Excel sheet is empty' });
    }

    // التحقق من الأعمدة المطلوبة
    const sheetHeaders = Object.keys(data[0]);
    const requiredFields = [
      'name', 'level', 'studentID', 'email', 'password', 'passwordConfirm',
      'phone', 'dateOfBirth', 'gender'
    ];

    const missingFields = requiredFields.filter(field => !sheetHeaders.includes(field));
    if (missingFields.length > 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`

      });

    }

    // إنشاء الطلاب وتخزين النتيجة
    const createdStudents = await Student.insertMany(data);

    res.status(201).json({
      status: 'success',
      message: 'Students imported successfully',
      count: createdStudents.length,
      data: {
        students: createdStudents,
      },
    });

    // حذف الملف بعد المعالجة بنجاح
    fs.unlinkSync(file.path);

  } catch (err) {
    // حذف الملف إذا حدث أي خطأ أثناء المعالجة
    if (file) fs.unlinkSync(file.path);

    res.status(500).json({ status: 'fail', message: err.message });
  }
};
