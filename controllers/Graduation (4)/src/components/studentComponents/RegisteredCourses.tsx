import { ArrowLeft, BookOpen } from 'lucide-react'
import React from 'react'

const RegisteredCourses = ({handleSectionChange,registeredCourses}) => {
  return (
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
          aria-label='back'
            onClick={() => handleSectionChange("dashboard")}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
            Registered Courses
          </h2>
        </div>
        <div className="text-sm text-gray-600">
          Total Credits:{" "}
          {registeredCourses.reduce((sum, course) => sum + course.creditHours, 0)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registeredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {course.name}
                </h3>
                <p className="text-blue-600 font-medium">{course.courseCode}</p>
              </div>
              
            </div>
            <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                <span className="font-medium">Course Name:</span>{" "}
                {course.courseName}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Instructor:</span>{" "}
                {course.instructor}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Credits:</span> {course.creditHours}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegisteredCourses