import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getAllDepartments } from "../../services/departmentServices";
import { showError } from "../../services/toastService";

const AddCourse = ({ handleAdd, setShown }) => {
  const [deps, setDeps] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    creditHours: "",
    term: "",
    department: ""
  });

  useEffect(() => {
    let isFetched = false;
    const getDeps = async () => {
      try {
        const departments = await getAllDepartments("/api/v1/departments");
        setDeps(departments);
      } catch (error) {
        showError(error);
      }
    };

    if (!isFetched) {
      getDeps();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Course</h2>
          <p className="text-sm text-gray-600 mt-1">Create a new course in the system</p>
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
          
          <div className="space-y-1">
            <label 
              htmlFor="department" 
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select 
              value={formData.department} 
              onChange={handleChange} 
              name="department" 
              id="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="" disabled className="text-gray-500">
                Select a department...
              </option>
              {deps.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add Course
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

export default AddCourse;

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