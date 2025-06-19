// libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// pages
import Login from "./pages/Login";
import WelcomePage from "./pages/Welcome";
import StudentDashboard from "./pages/studentPages/StudentDashboard";
import AffairDashboard from "./pages/affair/AffairDashboard";
import ManageStudents from "./pages/affair/ManageStudents";
import AddStudentForm from "./pages/AddNewStudent";
import ActivityStaff from "./pages/ActivityStaff";
import StudentControl from "./pages/StudentControl";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageDepartments from "./pages/affair/ManageDepartments";
import ManageCourses from "./pages/affair/ManageCourses";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <WelcomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/auth",
      element: <ProtectedRoute />,
      children: [
        {
          path: "student-dashboard",
          element: <StudentDashboard />,
        },
        {
          path: "affair-dashboard",
          element: <AffairDashboard />,
        },
        {
          path: "activity-dashboard",
          element: <AffairDashboard />,
        },
        {
          path: "affair-dashboard/manage-students",
          element: <ManageStudents />,
        },
        {
          path: "affair-dashboard/manage-courses",
          element: <ManageCourses />,
        },
        {
          path: "affair-dashboard/manage-departments",
          element: <ManageDepartments />,
        },
        {
          path: "affair-dashboard/manage-students/add-student",
          element: <AddStudentForm />,
        },
        {
          path: "activity-staff",
          element: <ActivityStaff />,
        },
        {
          path: "student-control",
          element: <StudentControl />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
