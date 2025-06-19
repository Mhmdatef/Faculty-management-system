import { ChangeEvent, FormEvent, useState } from "react";

const EditCourse = ({ course, handleEdit, setShown }) => {
  const [formData, setFormData] = useState({
    name: course.name,
    code: course.code,
    creditHours: course.creditHours,
    term: course.term,
    prerequisites: course.prerequisites,
  });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleEdit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Course</h2>
          <p className="text-sm text-gray-600 mt-1">Update course information</p>
        </div>
        
        <div className="p-6 space-y-4">
          <FormField
            type="text"
            label="Course Name"
            name="name"
            value={formData.name}
            handleChange={handleChange}
          />
          <FormField
            type="text"
            label="Course Code"
            name="code"
            value={formData.code}
            handleChange={handleChange}
          />
          <FormField
            type="number"
            label="Credit Hours"
            name="creditHours"
            value={formData.creditHours}
            handleChange={handleChange}
          />
          <FormField
            type="number"
            label="Term"
            name="term"
            value={formData.term}
            handleChange={handleChange}
          />
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShown(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;

function FormField({ type, label, name, value, handleChange }) {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
      />
    </div>
  );
}