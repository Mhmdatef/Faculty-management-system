import React, { useState } from 'react';
import { showError, showSuccess } from '../../services/toastService';
import { editDepartment } from '../../services/departmentServices';
import { X, Save, User, Building2, AlertCircle } from 'lucide-react';

const EditDepartment = ({ isEditShown, setisEditShownn, setDeps, deps }) => {
  const [formData, setFormData] = useState({
    name: isEditShown.name,
    headOfDepartment: isEditShown.headOfDepartment
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hadnleEditDep = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const addedDep = await editDepartment(`/api/v1/departments/${isEditShown._id}`, formData);
      console.log("addedDep", addedDep);
      const updatedDeps = deps.map(dep => {
        if (dep._id == addedDep._id) {
          return addedDep;
        }
        return dep;
      });
      console.log("updatedDeps", updatedDeps);
      
      setDeps(updatedDeps);
      showSuccess("Department edited successfully");
    } catch (error) {
      showError(error);
    } finally {
      setIsSubmitting(false);
      setisEditShownn("");
    }
  };

  const handleCancel = () => {
    setisEditShownn("");
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Department</h2>
            <p className="text-sm text-gray-600">Update department information</p>
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
            </label>
            <div className="relative">
              <input
                required
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter department name"
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
            </label>
            <div className="relative">
              <input
                required
                type="text"
                id="headOfDepartment"
                name="headOfDepartment"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, headOfDepartment: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter head of department name"
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Note</p>
              <p className="text-sm text-blue-700">
                Changes will be reflected immediately after saving. Make sure all information is accurate.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              onClick={hadnleEditDep}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Department
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

export default EditDepartment;