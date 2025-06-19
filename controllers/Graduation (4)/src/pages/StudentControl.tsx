import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents, getOneStudent } from "../services/studentServices";
import { showError, showSuccess } from "../services/toastService";
import { addCompletedCourse } from "../services/completedCourses.services";
import UploadFile from "../components/affair-manage-students/UploadFile";

interface StudentControlData {
  studentId: string;
  courseId: string;
  grade: string;
}

const StudentControl: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState<StudentControlData>({
    studentId: "",
    courseId: "",
    grade: "",
  });

  useEffect(() => {
    let isFetched = false;
    const getStds = async () => {
      try {
        const stds = await getAllStudents("/api/v1/students");
        setStudents(stds);
        isFetched = true;
      } catch (error) {
        showError(error);
      }
    };
    if (!isFetched) {
      getStds();
    }
  }, []);

  const navigate = useNavigate();

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name == "studentId") {
      const student = students.find((std) => std._id == value);
      setStudent(student);
      console.log(student);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCompletedCourse(formData);
      showSuccess("Course graded successfully");
      const std = students.find((std) => (std._id == student._id));
      const newRegistered = std.registeredCourses.filter(
        (crs) => crs.courseId != formData.courseId
      );
      std.registeredCourses = newRegistered;
      setFormData({
        studentId: "",
        courseId: "",
        grade: "",
      });
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Student Control Panel
          </h1>
          <p className="text-gray-600 text-lg">Manage student grades and course completions</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Bulk Upload</h3>
              <p className="text-gray-600">Upload completed courses data from CSV file</p>
            </div>
          </div>
          <UploadFile fileType="completed-courses" />
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Grade Student Course
            </h2>
            <p className="text-blue-100 mt-2">Select a student and course to assign a grade</p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Selection */}
              <div className="space-y-3">
                <label
                  htmlFor="studentId"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student Name
                </label>
                <div className="relative">
                  <select
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={`${
                      students.length == 0 
                        ? "bg-gray-100 cursor-not-allowed" 
                        : "bg-white hover:bg-gray-50"
                    } w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium appearance-none`}
                    required
                    disabled={students.length == 0}
                  >
                    <option value={""} hidden>
                      {students.length == 0 ? "Loading students..." : "Choose student here..."}
                    </option>
                    {students.map((std, index) => (
                      <option key={index} value={std._id}>{std.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {students.length == 0 && (
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Loading student data...
                  </p>
                )}
              </div>

              {/* Course Selection */}
              <div className="space-y-3">
                <label
                  htmlFor="courseId"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Course Name
                </label>
                <div className="relative">
                  <select
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    className={`${
                      (!student || !formData.studentId) 
                        ? "bg-gray-100 cursor-not-allowed text-gray-400" 
                        : "bg-white hover:bg-gray-50 text-gray-900"
                    } w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 font-medium appearance-none`}
                    required
                    disabled={!student || !formData.studentId}
                  >
                    <option value={""} hidden>
                      {(!student || !formData.studentId) ? "Select a student first..." : "Choose course here..."}
                    </option>
                    {student?.registeredCourses.map((cou, index) => (
                      <option key={index} value={cou.courseId}>{cou.courseName}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {(!student || !formData.studentId) && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please select a student to view their registered courses
                  </p>
                )}
              </div>

              {/* Grade Selection */}
              <div className="space-y-3 lg:col-span-2">
                <label
                  htmlFor="grade"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Grade Assignment
                </label>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { value: "A", color: "from-green-500 to-emerald-500", text: "Excellent" },
                    { value: "B", color: "from-blue-500 to-cyan-500", text: "Good" },
                    { value: "C", color: "from-yellow-500 to-orange-500", text: "Average" },
                    { value: "D", color: "from-orange-500 to-red-500", text: "Below Average" },
                    { value: "F", color: "from-red-500 to-pink-500", text: "Fail" }
                  ].map((grade) => (
                    <label
                      key={grade.value}
                      className={`relative cursor-pointer group ${
                        formData.grade === grade.value 
                          ? 'scale-105 shadow-lg' 
                          : 'hover:scale-102'
                      } transition-all duration-200`}
                    >
                      <input
                        type="radio"
                        name="grade"
                        value={grade.value}
                        checked={formData.grade === grade.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`
                        p-6 rounded-2xl text-center border-2 transition-all duration-200
                        ${formData.grade === grade.value 
                          ? `bg-gradient-to-br ${grade.color} text-white border-transparent shadow-lg` 
                          : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}>
                        <div className="text-3xl font-bold mb-2">{grade.value}</div>
                        <div className={`text-sm font-medium ${
                          formData.grade === grade.value ? 'text-white/90' : 'text-gray-500'
                        }`}>
                          {grade.text}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-gray-100">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="px-8 py-4 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentControl;