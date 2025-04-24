const express = require('express');
const morgan = require('morgan');
const studentRouter=require('./Routes/studentRoutes')
const staffRouter=require('./Routes/staffRoutes')
const courseRoutes = require('./Routes/courseRoutes');
const departmentRoutes=require('./Routes/departmentRoutes')
const activityRoutes = require('./Routes/activityRoutes');
const registeredCoursesRoutes = require('./Routes/registeredCourcesRoutes')
const completedCourseRoutes = require('./Routes/CompletedCourseRoutes')
const authRoutes = require('./Routes/authRoutes')


const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/students',studentRouter)
app.use('/api/v1/staff',staffRouter)
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/registeredCourses', registeredCoursesRoutes);
app.use('/api/v1/completedCourses', completedCourseRoutes);
app.use('/api/v1', authRoutes);

module.exports = app;
