import { ArrowLeft, GraduationCap, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAvailableCoursesByStudent, registerCourses } from "../../services/courseServices";
import { showError, showSuccess } from "../../services/toastService";

const RegisterNewCourse = ({
  handleSectionChange,
  registeredCourses,
  completedCourses,
  studentId,
  getStudent
}) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    let isFetched = false;
    async function getAvailableCourses() {
      const courses = await getAvailableCoursesByStudent(
        registeredCourses,
        completedCourses
      );
      setAvailableCourses(courses);
    }
    if (!isFetched) {
      isFetched = true;
      getAvailableCourses();
    }
  }, []);

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const totalSelectedCredits = selectedCourses.reduce((sum, _id) => {
    const course = availableCourses.find((c) => c._id === _id);
    return sum + (course ? course.creditHours : 0);
  }, 0);

  async function handleRegisterCourses(){
    try {
        const response=await registerCourses(studentId,selectedCourses)
        const newAvailableCourses=availableCourses.filter(course=>{
           if(!(selectedCourses.includes(course._id))){
            return course
           }
           
        })
        setSelectedCourses([])
        setAvailableCourses(newAvailableCourses)
        showSuccess("Courses registered successfully!")
        window.scrollTo({top:70, behavior:"smooth"})
        getStudent()
        
    } 
    catch (error) {
        showError(error.name+" : "+error.message)
    }
  }
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            aria-label="Back"
            onClick={() => handleSectionChange("dashboard")}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-6 w-6 mr-2 text-orange-600" />
            Register for Courses
          </h2>
        </div>
        <div className="text-sm text-gray-600">
          Selected: {selectedCourses.length} courses ({totalSelectedCredits}{" "}
          credits)
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourses.includes(course._id);
          return (
            <div
              key={course._id}
              className={`bg-white rounded-xl shadow-lg p-6 border transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-100 hover:border-gray-300"
              }`}
              onClick={() => toggleCourseSelection(course._id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {course.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{course.code}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <Plus className="h-3 w-3 text-white rotate-45" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Instructor:</span>{" "}
                  {course.instructor}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Credits:</span> {course.credits}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Prerequisites:</span>{" "}
                  {course.prerequisites}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Summary */}
      {selectedCourses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Registration Summary
          </h3>
          <div className="space-y-2 mb-4">
            {selectedCourses.map((_id) => {
              const course = availableCourses.find((c) => c._id === _id);
              return (
                <div
                  key={_id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="text-gray-900">
                    {course.name} ({course.code})
                  </span>
                  <span className="text-gray-600">
                    {course.creditHours} credits
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">
              Total Credits: {totalSelectedCredits}
            </span>
            <button onClick={handleRegisterCourses} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Register Selected Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterNewCourse;
