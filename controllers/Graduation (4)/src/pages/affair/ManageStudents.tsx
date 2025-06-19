import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteStudent,
  editStudent,
  getAllStudents,
} from "../../services/studentServices";
import { showError, showSuccess } from "../../services/toastService";
import EditStudent from "../../components/affair-manage-students/EditStudent";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import UploadFile from "../../components/affair-manage-students/UploadFile";
import AddStudentForm from "../AddNewStudent";
import AddStudent from "../../components/affair-manage-students/AddStudent";

interface Student {
  _id: number;
  id: number;
  name: string;
  email: string;
  phone?: string;
  level?: string;
  GPA: number;
  gpa: number;
  updated?: boolean;
}

// Custom hooks
const useModalState = () => {
  const [modals, setModals] = useState({
    isAddFormShown: false,
    isDeleteShown: false,
    isEditFormShown: false,
  });

  const toggleModal = useCallback((modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  const closeModal = useCallback((modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  return { modals, toggleModal, closeModal };
};

const useStudentData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(filterQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const allStudents = await getAllStudents("/api/v1/students");
      setStudents(allStudents);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudent = useCallback((updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(student =>
        student._id === updatedStudent._id ? updatedStudent : student
      )
    );
  }, []);

  const removeStudent = useCallback((studentId: number) => {
    setStudents(prev => prev.filter(student => student._id !== studentId));
  }, []);

  return {
    students,
    selectedStudent,
    filteredStudents,
    filterQuery,
    isLoading,
    setStudents,
    setSelectedStudent,
    setFilterQuery,
    fetchStudents,
    updateStudent,
    removeStudent,
  };
};

// Back Button Component
const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
  >
    <svg 
      className="w-4 h-4 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
    Back
  </button>
);

// Modern components
const SearchAndActions: React.FC<{
  filterQuery: string;
  onFilterChange: (value: string) => void;
  onAddStudent: () => void;
  studentCount: number;
}> = ({ filterQuery, onFilterChange, onAddStudent, studentCount }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
    <div className="flex-1 max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={filterQuery}
          onChange={(e) => onFilterChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {studentCount} student{studentCount !== 1 ? 's' : ''} found
      </p>
    </div>
    
    <div className="flex items-center gap-3">
      <button
        onClick={onAddStudent}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Student
      </button>
      <UploadFile />
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StudentCard: React.FC<{
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}> = ({ student, onEdit, onDelete }) => {
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600 bg-green-50';
    if (gpa >= 3.0) return 'text-yellow-600 bg-yellow-50';
    if (gpa >= 2.5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(student.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.name}
              </h3>
              {student.updated && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Updated
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                {student.email}
              </div>
              
              {student.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {student.phone}
                </div>
              )}
              
              {student.level && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  Level {student.level}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGPAColor(student.GPA)}`}>
            GPA: {student.GPA.toFixed(2)}
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(student)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(student)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ hasFilter: boolean }> = ({ hasFilter }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {hasFilter ? 'No students found' : 'No students yet'}
    </h3>
    <p className="text-gray-500 max-w-md mx-auto">
      {hasFilter 
        ? 'Try adjusting your search terms or clear the filter to see all students.'
        : 'Get started by adding your first student to the system.'
      }
    </p>
  </div>
);

// Main component
const ManageStudents: React.FC = () => {
  const navigate = useNavigate();
  const { modals, toggleModal, closeModal } = useModalState();
  const {
    students,
    selectedStudent,
    filteredStudents,
    filterQuery,
    isLoading,
    setStudents,
    setSelectedStudent,
    setFilterQuery,
    fetchStudents,
    updateStudent,
    removeStudent,
  } = useStudentData();

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEdit = useCallback(async (id: number, formData: any) => {
    try {
      const updatedStudent = await editStudent(`/api/v1/students/${id}`, formData);
      showSuccess("Student updated successfully");
      updateStudent(updatedStudent);
      setSelectedStudent(null);
      closeModal('isEditFormShown');
    } catch (error) {
      showError(error);
    }
  }, [updateStudent, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedStudent) return;
    
    try {
      await deleteStudent(`/api/v1/students/${selectedStudent._id}`);
      removeStudent(selectedStudent._id);
      showSuccess("Student deleted successfully");
      setSelectedStudent(null);
      closeModal('isDeleteShown');
    } catch (error) {
      showError(error);
    }
  }, [selectedStudent, removeStudent, closeModal]);

  const handleEditClick = useCallback((student: Student) => {
    setSelectedStudent(student);
    toggleModal('isEditFormShown');
  }, [setSelectedStudent, toggleModal]);

  const handleDeleteClick = useCallback((student: Student) => {
    setSelectedStudent(student);
    toggleModal('isDeleteShown');
  }, [setSelectedStudent, toggleModal]);

  const handleBackClick = useCallback(() => {
    navigate(-1); // Go back to previous page
  }, [navigate]);

  return (
    <>
      {/* Modals */}
      {modals.isDeleteShown && (
        <DeleteConfirmation
          text="Are you sure you want to delete this student? This action cannot be undone."
          callback={handleDelete}
          cancelProcess={() => closeModal('isDeleteShown')}
        />
      )}

      {modals.isEditFormShown && selectedStudent && (
        <EditStudent
          handleEdit={handleEdit}
          setisEditFormShown={() => closeModal('isEditFormShown')}
          student={selectedStudent}
        />
      )}

      {modals.isAddFormShown && (
        <AddStudent
          setStudents={setStudents}
          setisAddFormShown={() => closeModal('isAddFormShown')}
        />
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton onClick={handleBackClick} />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Student Management
            </h1>
          </div>

          {/* Search and Actions */}
          <SearchAndActions
            filterQuery={filterQuery}
            onFilterChange={setFilterQuery}
            onAddStudent={() => toggleModal('isAddFormShown')}
            studentCount={filteredStudents.length}
          />

          {/* Content */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredStudents.length > 0 ? (
            <div className="grid gap-4 lg:gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState hasFilter={!!filterQuery} />
          )}
        </div>
      </div>
    </>
  );
};

export default ManageStudents;