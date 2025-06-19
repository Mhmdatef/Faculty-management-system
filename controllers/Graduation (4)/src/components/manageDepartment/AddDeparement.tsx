import React, { useState } from "react";
import { addDepartment } from "../../services/departmentServices";
import { showError, showSuccess } from "../../services/toastService";
import { X, Plus, User, Building2, AlertCircle } from 'lucide-react';

const AddDeparement = ({ setDeps, setIsAddShown }) => {
  const [formData, setFormData] = useState({
    name: "",
    headOfDepartment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hadnleAddDep = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const addedDep = await addDepartment("/api/v1/departments", formData);
      console.log("addedDep", addedDep);
      
      setDeps(prev => ([...prev, addedDep]));
      showSuccess("Department added successfully");
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
      setIsAddShown(false);
    }
  };

  const handleCancel = () => {
    setIsAddShown(false);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Plus className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Department</h2>
            <p className="text-sm text-gray-600">Create a new department in your organization</p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Department Name Field */}
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Building2 className="w-4 h-4" />
              Department Name
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., Computer Science, Mathematics, Physics"
              />
            </div>
          </div>

          {/* Head of Department Field */}
          <div className="space-y-2">
            <label 
              htmlFor="headOfDepartment" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <User className="w-4 h-4" />
              Head of Department
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type="text"
                id="headOfDepartment"
                name="headOfDepartment"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, headOfDepartment: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., Dr. John Smith, Prof. Sarah Johnson"
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium">Getting Started</p>
              <p className="text-sm text-green-700">
                After creating the department, you can add courses and assign faculty members through the department management panel.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              onClick={hadnleAddDep}
              disabled={isSubmitting || !formData.name.trim() || !formData.headOfDepartment.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Department...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Department
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDeparement;