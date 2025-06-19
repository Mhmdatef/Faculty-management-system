import { useEffect, useState } from "react";
import { deleteDepartment, getAllDepartments } from "../../services/departmentServices";
import { showError, showSuccess } from "../../services/toastService";
import AddDeparement from "../../components/manageDepartment/AddDeparement";
import EditDepartment from "../../components/manageDepartment/EditDepartment";
import { Trash2, Edit, Plus, Building2, Users, BookOpen, Calendar, Search, Filter } from "lucide-react";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [isAddShow, setIsAddShown] = useState(false);
  const [isEditShown, setisEditShownn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isFetched = false;
    const getDepartments = async () => {
      try {
        setLoading(true);
        const deps = await getAllDepartments("/api/v1/departments");
        setDepartments(deps);
        isFetched = true;
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };
    if (!isFetched) {
      getDepartments();
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(`/api/v1/departments/${id}`);
      const newDeps = departments.filter(dep => dep._id != id);
      setDepartments(newDeps);
      showSuccess("Department deleted successfully");
    } catch (error) {
      showError(error);
    }
  };

  const filteredDepartments = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Modals */}
      {isAddShow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        {isAddShow&&<AddDeparement setIsAddShown={setIsAddShown} setDeps={setDepartments} />}

          </div>
        </div>
      )}
      
      {isEditShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {isEditShown&&<EditDepartment isEditShown={isEditShown} setisEditShownn={setisEditShownn} setDeps={setDepartments} deps={departments} />}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Departments</h1>
              <p className="text-gray-600">Organize and manage all academic departments</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search departments or heads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => setIsAddShown(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Department
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">
                  {departments.reduce((acc, dep) => acc + (dep.courses?.length || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Department Heads</p>
                <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading departments...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 p-6 font-semibold text-gray-700">
                  <div className="col-span-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Name
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Head Of Department
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    # of Courses
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created At
                  </div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredDepartments.length === 0 ? (
                  <div className="text-center py-16">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first department"}
                    </p>
                  </div>
                ) : (
                  filteredDepartments.map((dep, index) => (
                    <div
                      key={dep._id}
                      className={`grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <div className="col-span-3">
                        <div className="font-semibold text-gray-900">{dep.name}</div>
                      </div>
                      <div className="col-span-3">
                        <div className="text-gray-700">{dep.headOfDepartment}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {dep.courses?.length || 0} courses
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-600">
                          {new Date(dep.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center gap-2">
                        <button
                          onClick={() => setisEditShownn(dep)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dep._id)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;