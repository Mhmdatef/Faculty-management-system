import { FormEvent, useEffect, useState, useCallback } from "react";
import { X, Users, Building2, ChevronDown } from "lucide-react";
import { getAllDepartments } from "../../services/departmentServices";
import { showError } from "../../services/toastService";

interface Department {
  _id: string;
  name: string;
}

interface AssignCouToDepProps {
  setAssignToDepShown: (shown: boolean) => void;
  hadleAssignToDep: (departmentId: string) => void;
  courseName?: string; // Optional prop to show which course is being assigned
}

const AssignCouToDep: React.FC<AssignCouToDepProps> = ({ 
  setAssignToDepShown, 
  hadleAssignToDep,
  courseName 
}) => {
  const [deps, setDeps] = useState<Department[]>([]);
  const [dep, setDep] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Memoized function to fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const departments = await getAllDepartments("/api/v1/departments");
      setDeps(departments);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!dep) {
      showError("Please select a department");
      return;
    }

    try {
      setSubmitting(true);
      await hadleAssignToDep(dep);
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setAssignToDepShown(false);
  }, [setAssignToDepShown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Assign Course</h2>
              {courseName && (
                <p className="text-sm text-gray-600 mt-1">
                  Assign "{courseName}" to department
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label 
              htmlFor="departmentId" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Department
            </label>
            
            {loading ? (
              <div className="relative">
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-500">Loading departments...</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={dep}
                  onChange={(e) => setDep(e.target.value)}
                  name="departmentId"
                  id="departmentId"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-gray-900 transition-colors"
                  disabled={submitting}
                  required
                >
                  <option value="" disabled>
                    Choose a department...
                  </option>
                  {deps.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            )}
            
            {deps.length === 0 && !loading && (
              <p className="text-sm text-amber-600 mt-2 flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>No departments available</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || submitting || !dep || deps.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Assign Course</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCouToDep;