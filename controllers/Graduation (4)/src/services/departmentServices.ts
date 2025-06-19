import axiosInstance from "../api/axiosInstance";

export const getAllDepartments = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);
    console.log(res.data);

    return res.data.data.departments;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`;
  }
};


export const addDepartment = async (url: string,formData) => {
  try {
    const res = await axiosInstance.post(url,formData);
    console.log(res.data);

    return res.data.data.department;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`;
  }
};

export const editDepartment = async (url: string,formData) => {
  try {
    const res = await axiosInstance.patch(url,formData);
    console.log(res.data);

    return res.data.data.department;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`;
  }
};

export const deleteDepartment = async (url: string) => {
  try {
    const res = await axiosInstance.delete(url);
    console.log(res.data);

    return res.data.data;
  } catch (err) {
    console.log(err);
    throw `${err.name}: ${err.message}`;
  }
};

