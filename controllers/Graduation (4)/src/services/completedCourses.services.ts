import axiosInstance from "../api/axiosInstance";

export const addCompletedCourse = async (body) => {
  try {
    const res = await axiosInstance.post("/api/v1/completedCourses", {
      student: body.studentId,
      course: body.courseId,
      grade: body.grade,
    });
    console.log(res.data);

    return res.data.data;
  } catch (error) {
    throw `${error.name}: ${error.message}`;
  }
};

export const uploadCompletedCourse = async (url,formData) => {
  try {
    const res = await axiosInstance.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res.data);

    return res.data.data;
  } catch (error) {
    throw `${error.name}: ${error.message}`;
  }
};
