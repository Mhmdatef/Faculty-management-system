import React from "react";
import { Edit3, Trash2, Calendar, User, BookOpen, BadgePlus } from "lucide-react";
import EditActivity from "./EditActivity";
import AddActivity from "./AddActivity";

const Table = ({ filteredStudents, handleEdit, handleDelete,handleAdd }) => {
  const [student, setstudent] = React.useState([]);
  const [isEditShown, setisEditShown] = React.useState(false);
  const [isAddShown, setisAddShown] = React.useState(false);

  return (
    <div className="w-full">
      <EditActivity 
        student={student} 
        isEditShown={isEditShown} 
        setisEditShown={setisEditShown} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />
      <AddActivity 
        isAddShown={isAddShown} 
        setisAddShown={setisAddShown} 
        handleAdd={handleAdd}
        studentId={student._id} 
      />
      
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-4 p-4">
          {filteredStudents.map((student) => {
            if (student.activities?.length > 0) {
              return (
                <div key={student._id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {student.name[0].toUpperCase() + student.name.slice(1)}
                      </h3>
                    </div>
                    <button
                      onClick={() => {setstudent(student); setisEditShown(true);}}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {setstudent(student);setisAddShown(true)}}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {student.activities.map((activity, index) => (
                      <div key={activity.date} className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-indigo-600 text-sm font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className={`text-gray-800 font-medium ${activity.hotUpdated ? "text-blue-600" : ""}`}>
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(activity.date).toDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <User className="w-5 h-5" />
                  Student Name
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <BookOpen className="w-5 h-5" />
                  Activities
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Calendar className="w-5 h-5" />
                  Date
                </div>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="text-gray-700 font-semibold">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student, studentIndex) => {
              if (student.activities?.length > 0) {
                return (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {student.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium text-lg">
                            {student.name[0].toUpperCase() + student.name.slice(1)}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {student.activities.length} {student.activities.length === 1 ? 'activity' : 'activities'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {student.activities.map((activity, index) => (
                          <div key={activity.date} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-indigo-600 text-sm font-medium">{index + 1}</span>
                            </div>
                            <div className={`text-gray-800 font-medium ${activity.hotUpdated ? "text-blue-600 font-semibold" : ""}`}>
                              {activity.description}
                              {activity.hotUpdated && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Updated
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {student.activities.map((activity) => (
                          <div key={activity.date} className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {new Date(activity.date).toDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {setstudent(student);setisAddShown(true);}}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          <BadgePlus className="w-4 h-4"  />
                          Add
                        </button>
                        <button
                          onClick={() => {setstudent(student); setisEditShown(true);}}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        

                      </div>
                    </td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;