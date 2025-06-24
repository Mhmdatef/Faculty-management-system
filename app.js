const express = require('express');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

// Routes imports
const studentRouter = require('./Routes/studentRoutes');
const staffRouter = require('./Routes/staffRoutes');
const courseRoutes = require('./Routes/courseRoutes');
const departmentRoutes = require('./Routes/departmentRoutes');
const activityRoutes = require('./Routes/activityRoutes');
const registeredCoursesRoutes = require('./Routes/registeredCourcesRoutes');
const completedCourseRoutes = require('./Routes/CompletedCourseRoutes');
const authRoutes = require('./Routes/authRoutes');
const prerequisiteRoutes = require('./Routes/prerequisiteRoutes');

const app = express();
app.use(cors());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Faculty Management System API',
      version: '1.0.0',
      description: 'API Documentation for Faculty Management System',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'], // path to annotated route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1', authRoutes); // includes /control/login, /staff/update_password, etc.
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/registeredCourses', registeredCoursesRoutes);
app.use('/api/v1/completedCourses', completedCourseRoutes);
app.use('/api/v1/prerequisites', prerequisiteRoutes);

module.exports = app;
