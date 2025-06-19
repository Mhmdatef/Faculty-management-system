const express = require('express');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');  // استيراد الحزمة الخاصة بالتوثيق
const swaggerUi = require('swagger-ui-express');  // استيراد الحزمة الخاصة بعرض الـ UI للتوثيق

const studentRouter = require('./Routes/studentRoutes');
const staffRouter = require('./Routes/staffRoutes');
const courseRoutes = require('./Routes/courseRoutes');
const departmentRoutes = require('./Routes/departmentRoutes');
const activityRoutes = require('./Routes/activityRoutes');
const registeredCoursesRoutes = require('./Routes/registeredCourcesRoutes');
const completedCourseRoutes = require('./Routes/completedCourseRoutes');
const authRoutes = require('./Routes/authRoutes');
const prerequisiteRoutes = require('./Routes/prerequisiteRoutes');
const cors = require('cors');


const app = express();
app.use(cors())

// إعدادات Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Faculty Management System API',
      version: '1.0.0',
      description: 'API Documentation for Faculty Management System',
    },
  },
  apis: ['./Routes/*.js'],  // المسار الذي يحتوي على التوثيق في Routes
};

// إنشاء التوثيق باستخدام swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// إعداد المسار لعرض التوثيق على الـ UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) Routes
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/registeredCourses', registeredCoursesRoutes);
app.use('/api/v1/completedCourses', completedCourseRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/prerequisites', prerequisiteRoutes);

module.exports = app;
