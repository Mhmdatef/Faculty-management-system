import { FormEvent, useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Users, GraduationCap, Clock, BookOpen, Hash, Award } from "lucide-react";
import {
  addCourse,
  assignCourseToDep,
  deleteCourse,
  editCourse,
  getAllCourses,
} from "../../services/courseServices";
import { showError, showSuccess } from "../../services/toastService";
import EditCourse from "../../components/affair-manage-students/EditCourse";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import AssignCouToDep from "../../components/affair-manage-students/AssignCouToDep";
import AddCourse from "../../components/affair-manage-students/AddCourse";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [isEditShown, setIsEditShown] = useState(false);
  const [isDeleteShown, setIsDeleteShown] = useState(false);
  const [assignToDepShown, setAssignToDepShown] = useState(false);
  const [isAddShown, setisAddShown] = useState(false);

  useEffect(() => {
    let isFetched = false;
    const getCourses = async () => {
      try {
        const allcourses = await getAllCourses();
        setCourses(allcourses);
        isFetched = true;
      } catch (error) {
        showError(error);
      }
    };

    if (!isFetched) {
      getCourses();
    }
  }, []);

  const handleEdit = async (newData) => {
    try {
      const updatedCourse = await editCourse(course._id, newData);
      const updatedCourses = courses.map((cou) => {
        if (cou._id == course._id) {
          updatedCourse.updatedCourse = true;
          return updatedCourse;
        }
        return cou;
      });
      setCourses(updatedCourses);
      console.log(updatedCourse);
      showSuccess("Course updated successfully");
      setIsEditShown(false);
    } catch (error) {
      showError(error);
    }
  };

  const hadleDelete = async () => {
    try {
      await deleteCourse(course._id);
      const crs = courses.filter((c) => c._id != course._id);
      setCourses(crs);
      showSuccess("Course deleted successfully");
      setIsDeleteShown(false);
    } catch (error) {
      showError(error);
    }
  };

  const hadleAssignToDep = async (dep) => {
    try {
      await assignCourseToDep({
        courseId: course._id,
        departmentId: dep,
      });
      showSuccess(`Course assigned to department ${dep} successfully`);
      setAssignToDepShown(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleAdd = async (newData) => {
    try {
      const addedCourse = await addCourse(newData);
      setCourses(prev=>([addedCourse,...prev]));
      console.log(addedCourse);
      showSuccess("Course added successfully");
      setisAddShown(false);
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Your existing modals - unchanged */}
      {isEditShown && (
        <EditCourse
          course={course}
          setShown={setIsEditShown}
          handleEdit={handleEdit}
        />
      )}
      {isDeleteShown && (
        <DeleteConfirmation
          text={"Are you sure"}
          cancelProcess={() => setIsDeleteShown(false)}
          callback={hadleDelete}
        />
      )}
      {assignToDepShown && (
        <AssignCouToDep
          setAssignToDepShown={setAssignToDepShown}
          hadleAssignToDep={hadleAssignToDep}
        />
      )}
      {isAddShown && (
        <AddCourse setShown={setisAddShown} handleAdd={handleAdd} />
      )}

      {/* Modern Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-1">Manage your academic courses and assignments</p>
              </div>
            </div>
            
            <button 
              onClick={() => setisAddShown(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Course</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Credit Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + (course.creditHours || 0), 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Updated Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(course => course.updatedCourse).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Courses Overview</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: "Course Name", icon: BookOpen },
                    { label: "Code", icon: Hash },
                    { label: "Credit Hours", icon: Award },
                    { label: "Term", icon: Clock },
                    { label: "Prerequisites", icon: GraduationCap },
                    { label: "Actions", icon: null }
                  ].map((header, index) => (
                    <th key={index} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        {header.icon && <header.icon className="w-4 h-4" />}
                        <span>{header.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <tr key={course._id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                            <span>{course.name}</span>
                            {course.updatedCourse && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Updated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-800 text-sm font-mono px-3 py-1 rounded-lg">
                        {course.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{course.creditHours}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-lg">
                        {course.term}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {course.prerequisite && course.prerequisite.length > 0 ? (
                          <ol className="list-decimal list-inside space-y-1">
                            {course.prerequisite.map((pre, preIndex) => (
                              <li key={preIndex} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded mb-1">
                                {pre.name}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <span className="text-sm text-gray-400 italic">No prerequisites</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setAssignToDepShown(true);
                            setCourse(course);
                          }}
                          className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors duration-200 group"
                          title="Assign to Department"
                        >
                          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditShown(true);
                            setCourse(course);
                          }}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors duration-200 group"
                          title="Edit Course"
                        >
                          <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteShown(true);
                            setCourse(course);
                          }}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-200 group"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first course</p>
              <button 
                onClick={() => setisAddShown(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;