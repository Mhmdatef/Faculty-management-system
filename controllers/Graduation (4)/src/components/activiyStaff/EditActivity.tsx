import React from "react";
import { X, Edit3, Trash2, Save, Calendar, Tag, User, AlertTriangle } from "lucide-react";
import DeleteConfirmation from "../DeleteConfirmation";

const EditActivity = ({ student, isEditShown, setisEditShown, handleEdit, handleDelete, }) => {
  if (!(student.activities?.length > 0 && isEditShown)) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Activities</h2>
                <div className="flex items-center gap-2 mt-1 text-blue-100">
                  <User className="w-4 h-4" />
                  <span className="text-lg">
                    {student.name[0].toUpperCase() + student.name.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setisEditShown(false)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="space-y-6">
            {student.activities.map((act, index) => (
              <ActEdit 
                key={act.date} 
                act={act} 
                handleEdit={handleEdit} 
                id={student._id} 
                handleDeleteAct={handleDelete}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActivity;

const ActEdit = ({ act, handleEdit, id, handleDeleteAct, index, }) => {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: act.description,
    type: act.type,
  });
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEditAct = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await handleEdit(act, formData, id);
      setIsEditing(false);
    } catch (error) {
      setIsEditing(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <>
      {deleteConfirm && (
        <DeleteConfirmation 
          text={`Are you sure you want to delete this activity: "${act.description}"?`}
          callback={() => handleDeleteAct(act, id)} 
          cancelProcess={cancelDelete} 
        />
      )}
      
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <form onSubmit={handleEditAct} className="space-y-4">
          {/* Activity Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {index + 1}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {new Date(act.date).toDateString()}
              </span>
            </div>
            {act.hotUpdated && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                Recently Updated
              </span>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor={`desc-${act._id}`}>
                <Edit3 className="w-4 h-4" />
                Activity Description
              </label>
              <textarea
                id={`desc-${act._id}`}
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Enter activity description..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor={`type-${act._id}`}>
                <Tag className="w-4 h-4" />
                Activity Type
              </label>
              <input
                type="text"
                id={`type-${act._id}`}
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter activity type..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isEditing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isEditing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              Delete Activity
            </button>
          </div>
        </form>
      </div>
    </>
  );
};