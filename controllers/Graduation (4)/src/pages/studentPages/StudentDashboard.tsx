import { useState, useEffect } from "react";
import { GraduationCap, Bell, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getOneStudent } from "../../services/studentServices";
import RegisteredCourses from "../../components/studentComponents/RegisteredCourses";
import CompletedCourses from "../../components/studentComponents/CompletedCourses";
import Activities from "../../components/studentComponents/Activities";
import RegisterNewCourse from "../../components/studentComponents/RegisterNewCourse";
import Dashboard from "../../components/studentComponents/Dashboard";

const StudentDashboard = () => {
  const [student, setStudent] = useState({});

  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section

  const location = useLocation();
  const studentData = location.state;

  const getStudent = async () => {
    const student = await getOneStudent(
      `/api/v1/students/${studentData.user.id}`,
      studentData.token
    );
    setStudent(student);
  };
  useEffect(() => {
    let isFetched = false;
    if (!isFetched) {
      getStudent();
      isFetched = true;
    }
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Student Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {student.name}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                aria-label="notifications"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                aria-label="Settings"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {student.name?.charAt(0) || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render different sections based on activeSection state */}
        {activeSection === "dashboard" && (
          <Dashboard
            handleSectionChange={handleSectionChange}
            student={student}
          />
        )}
        {activeSection === "registered" && (
          <RegisteredCourses
            handleSectionChange={handleSectionChange}
            registeredCourses={student.registeredCourses}
          />
        )}
        {activeSection === "completed" && (
          <CompletedCourses
            handleSectionChange={handleSectionChange}
            completedCourses={student.completedCourses}
          />
        )}
        {activeSection === "activities" && (
          <Activities
            handleSectionChange={handleSectionChange}
            activities={student.activities}
          />
        )}
        {activeSection === "register" && (
          <RegisterNewCourse
            handleSectionChange={handleSectionChange}
            registeredCourses={student.registeredCourses}
            completedCourses={student.completedCourses}
            studentId={student._id}
            getStudent={getStudent}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
