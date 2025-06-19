import React, { useEffect, useState } from "react";
import { getAllStudents } from "../services/studentServices";
import { Search, Users, Activity } from "lucide-react";
import Table from "../components/activiyStaff/Table";
import { showError, showSuccess } from "../services/toastService";
import {
  addActivity,
  deleteActivity,
  editActivity,
} from "../services/activityServices";

const ActivityStaff: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    let isFetched = false;
    const getStudents = async () => {
      const students = await getAllStudents("/api/v1/students");
      setStudents(students);
      setIsLoading(false);
    };
    if (!isFetched) {
      getStudents();
      isFetched = true;
    }
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handelSubmit = (e: React.FormEventHandler<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleAdd = async (formData, studentId) => {
    if (!(formData.description || formData.date)) {
      showError("Data is required");
      return;
    }
    try {
      const newAct = await addActivity(studentId, formData.type,formData.description);
      console.log("newAct",newAct);
      
      // const newStudents = students.map(student => {
      //   if (student._id == studentId) {
      //     const studentAct = student.activities.find(activity => activity._id == act._id)
      //     studentAct.type = updatedAct.type;
      //     studentAct.hotUpdated = true
      //     studentAct.description = updatedAct.description;
      //   }
      //   return student
      // })
      const student = students.find((student) => student._id == studentId);
      console.log("student",student);
      
      student.activities.push(newAct);

      showSuccess("activity added successfully");
    } catch (error) {
      showError(error);
    }
  };

  const handleEdit = async (act, formData, studentId) => {
    if (!(act.description && act.date)) {
      showError("Data is required");
      return;
    }
    try {
      const updatedAct = await editActivity(
        act._id,
        formData.type,
        formData.description
      );

      const newStudents = students.map((student) => {
        if (student._id == studentId) {
          const studentAct = student.activities.find(
            (activity) => activity._id == act._id
          );
          studentAct.type = updatedAct.type;
          studentAct.hotUpdated = true;
          studentAct.description = updatedAct.description;
        }
        return student;
      });
      setStudents(newStudents);

      showSuccess("activity updated successfully");
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = async (act, studentId) => {
    try {
      await deleteActivity(act._id);
      const newStudents = students.map((student) => {
        if (student._id == studentId) {
          student.activities = student.activities.filter(
            (activity) => activity._id != act._id
          );
        }
        return student;
      });
      setStudents(newStudents);

      showSuccess("activity deleted successfully");
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Activity Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage student activities and track progress
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <form onSubmit={handelSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Search students by name..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 text-lg"
              />
            </div>
          </form>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                Loading student data...
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No students found
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <Table
              filteredStudents={filteredStudents}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleAdd={handleAdd}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStaff;
