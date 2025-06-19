import axiosInstance from "../api/axiosInstance";

export const addActivity = async (
  studentId:string,
  type?: string,
  description?: string
) => {
  console.log(studentId);
  
  try {
    const res = await axiosInstance.post(`/api/v1/activities`, {
      student:studentId,
      type,
      description,
    });
    return res.data.data.Activity;
  } catch (error) {
    throw `${error.response.data.status}: ${error.response.data.message}`;
  }
};

export const editActivity = async (
  id: string,
  type?: string,
  description?: string
) => {
  try {
    const res = await axiosInstance.patch(`/api/v1/activities/${id}`, {
      type,
      description,
    });
    return res.data.data.updatedActivity;
  } catch (error) {
    throw `${error.response.data.status}: ${error.response.data.message}`;
  }
};

export const deleteActivity = async (
  id: string,
) => {
  try {
    await axiosInstance.delete(`/api/v1/activities/${id}`);
  } catch (error) {
    throw `${error.response.data.status}: ${error.response.data.message}`;
  }
};
