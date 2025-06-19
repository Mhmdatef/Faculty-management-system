import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, FileText } from 'lucide-react';
import { uploadStudents } from '../../services/studentServices';
import { showError, showSuccess } from '../../services/toastService';
import { uploadCompletedCourse } from '../../services/completedCourses.services';

const UploadFile = ({fileType="student"}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && (selectedFile.type === 'text/xlsx' || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile);
    } else {
      showError('Please select a CSV file');
    }
  };

  const confirmUpload = async () => {
    if (!file) return;
    
    const confirm = window.confirm("Are you sure you want to upload this file?");
    if (confirm) {
      await uploadStudent();
    } else {
      setFile(null);
    }
  };

  const uploadStudent = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      if(fileType=="student"){
      await uploadStudents("/api/v1/students/upload", formData);
      }else{
        await uploadCompletedCourse("/api/v1/completedCourses/upload", formData);
      }
      showSuccess("File uploaded successfully");
      setFile(null);
      setShowModal(false);
    } catch (error) {
      showError(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Upload Button */}
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600 font-medium"
      >
        <Upload className="w-5 h-5 mr-2" />
        Upload CSV
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upload Students</h3>
                  <p className="text-sm text-gray-500">Upload a CSV file with student data</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : file 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">File ready to upload</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-700">
                        <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">CSV files only, up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Format Info */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">CSV Format Requirements</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Include columns: studentID, name, email, phone, gender, dateOfBirth, level, totalCreditsCompleted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            {file && (
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={confirmUpload}
                    disabled={isUploading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload File
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UploadFile;