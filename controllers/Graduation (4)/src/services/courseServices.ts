import axiosInstance from "../api/axiosInstance";

export const registerCourses = async (studentId, registeredCourses) => {
  try {
    const res = await axiosInstance.post("/api/v1/registeredCourses", {
      student: studentId,
      courses: registeredCourses,
    });
    return res.data;
  } catch (error) {
    return error
  }
};

export const getAllCourses = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/courses");
    console.log(res.data);

    return res.data.data.courses;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`
  }
};

export const getAvailableCoursesByStudent = async (
  registeredCourses,
  completedCourses
) => {
  const allCourses = await getAllCourses();

  console.log("allCourses",allCourses);
  
  
  const availableCourses = allCourses.filter((course) => {
    let flag = true;
    registeredCourses.forEach((registeredCourse) => {
      if (course._id == registeredCourse.courseId) {
        flag = false;
        return;
      }
    });
    completedCourses.forEach((completedCourse) => {
      if (course._id == completedCourse.courseId) {
        flag = false;
        return;
      }
    });
    if (flag) {
      return course;
    }
  });
  console.log("availableCourses",availableCourses);
  
  return availableCourses;
};

export const editCourse = async (id,body) => {
  try {
    const res = await axiosInstance.patch(`/api/v1/courses/${id}`,body);
    console.log(res.data);

    return res.data.data.course;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`
  }
};

export const addCourse = async (body) => {
  try {
    const res = await axiosInstance.post(`/api/v1/courses`,body);
    console.log(res.data);

    return res.data.data.course;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/v1/courses/${id}`);
    console.log(res.data);

    return res.data;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`
  }
};

export const assignCourseToDep = async (body) => {
  try {
    const res = await axiosInstance.post(`/api/v1/courses/assign-to-department`,body);
    console.log(res.data);

    return res.data.data;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`
  }
};


