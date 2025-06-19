import {
  User,
  BookOpen,
  Trophy,
  GraduationCap,
  Mail,
  CreditCard,
  TrendingUp,
  Clock,
  Award,
  Target,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = ({ handleSectionChange, student }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  

  const upcomingDeadlines = [
    {
      course: "Machine Learning",
      assignment: "Final Project",
      due: "Dec 15",
      priority: "high",
    },
    {
      course: "Database Systems",
      assignment: "Query Optimization",
      due: "Dec 18",
      priority: "medium",
    },
    {
      course: "Operating Systems",
      assignment: "Thread Synchronization",
      due: "Dec 20",
      priority: "low",
    },
  ];
  return (
    <>
      {/* Welcome Section */}
      <div
        className={`mb-8 transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {student.name}! 🎓
            </h2>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 delay-200 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <StudentInfoItem
          course={{
            icon: BookOpen,
            color: "bg-blue-500",
            label: "Current Courses",
            value: student.registeredCourses?.length || 0,
          }}
        />
        <StudentInfoItem
          course={{
            icon: Trophy,
            label: "GPA",
            value: student.GPA || "N/A",
            color: "bg-green-500",
          }}
        />
        <StudentInfoItem
          course={{
            icon: CreditCard,
            label: "Credits Left",
            value: student.reminderCredits || 0,
            color: "bg-purple-500",
          }}
        />
        <StudentInfoItem
          course={{
            icon: Award,
            label: "Achievements",
            value: "8",
            color: "bg-orange-500",
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Information Card */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Student Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {student.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-semibold text-gray-900">
                      {student.studentID}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Major</p>
                    <p className="font-semibold text-gray-900">
                      Computer Science
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Academic Level</p>
                    <p className="font-semibold text-gray-900">
                      {student.level}rd Year
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">GPA</p>
                    <p className="font-semibold text-gray-900">{student.GPA}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-600">Enrolled Since</p>
                    <p className="font-semibold text-gray-900">
                      {student.enrollmentDate
                        ? new Date(student.enrollmentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Registered Courses",
                  icon: BookOpen,
                  color: "from-blue-500 to-blue-600",
                  action: () => handleSectionChange("registered"),
                },
                {
                  title: "Completed Courses",
                  icon: Trophy,
                  color: "from-green-500 to-green-600",
                  action: () => handleSectionChange("completed"),
                },
                {
                  title: "View Activities",
                  icon: Activity,
                  color: "from-purple-500 to-purple-600",
                  action: () => handleSectionChange("activities"),
                },
                {
                  title: "Register Courses",
                  icon: GraduationCap,
                  color: "from-orange-500 to-orange-600",
                  action: () => handleSectionChange("register"),
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group relative bg-gradient-to-r text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${action.color} rounded-xl`}
                  ></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <action.icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {student.activities?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-3 h-3 rounded-full mr-3 mt-2 ${
                      Number.isInteger((index+3)/3)?  "bg-green-500"
                        : Number.isInteger((index-1)/3)
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {activity.description}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Deadlines */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 delay-600 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2 text-red-600" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {deadline.course}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deadline.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : deadline.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {deadline.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {deadline.assignment}
                  </p>
                  <p className="text-gray-500 text-xs">Due: {deadline.due}</p>
                </div>
              ))}
            </div>
          </div>

          {/* GPA Progress */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-1000 delay-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Academic Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current GPA
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {student.GPA}/4.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((student.GPA || 0) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Credits Completed
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {/* 100/120 */}
                    {student.totalCreditsCompleted} / {student.totalCreditsCompleted+student.reminderCredits}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(student.totalCreditsCompleted / (student.totalCreditsCompleted + student.reminderCredits)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white transform transition-all duration-1000 delay-800 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Need Help?
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Contact academic advisor or student support for assistance.
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;


const StudentInfoItem = ({ course }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{course.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {course.value}
          </p>
        </div>
        <div className={`${course.color} rounded-lg p-3`}>
          <course.icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};
