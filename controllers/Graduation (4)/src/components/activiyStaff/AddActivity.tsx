import React from "react";
import { X, Plus, Tag, Edit3, Save, Calendar } from "lucide-react";

const AddActivity = ({ isAddShown, setisAddShown, handleAdd, studentId }) => {
  const [formData, setFormData] = React.useState({
    type: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isAddShown) {
    return null;
  }

  console.log("studentId", studentId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type && formData.description) {
      setIsSubmitting(true);
      try {
        await handleAdd(formData, studentId);
        setFormData({ type: "", description: "" }); // Reset form
        setisAddShown(false);
      } catch (error) {
        console.error("Error adding activity:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ type: "", description: "" }); // Reset form on cancel
    setisAddShown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Activity</h2>
                <p className="text-green-100 text-sm mt-1">Create a new activity entry</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Type */}
            <div className="space-y-2">
              <label 
                className="flex items-center gap-2 text-sm font-semibold text-gray-700" 
                htmlFor="type"
              >
                <Tag className="w-4 h-4" />
                Activity Type
              </label>
              <input
              type="text"
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200"
                required
              />
            </div>

            {/* Activity Description */}
            <div className="space-y-2">
              <label 
                className="flex items-center gap-2 text-sm font-semibold text-gray-700" 
                htmlFor="description"
              >
                <Edit3 className="w-4 h-4" />
                Activity Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 resize-none"
                placeholder="Enter detailed description of the activity..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a clear and detailed description of the activity
              </p>
            </div>

            {/* Date Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold text-sm">Activity Date</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                This activity will be recorded with today's date: {new Date().toDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.type || !formData.description}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Add Activity
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddActivity;