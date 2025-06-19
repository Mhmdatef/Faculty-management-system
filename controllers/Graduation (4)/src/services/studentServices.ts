import axiosInstance from "../api/axiosInstance";
import { Student } from "../interfaces/Student.interface";
import { showError, showSuccess } from "./toastService";

export const loginUser = (
  type: string,
  data: { email: string; pass: string },
  callback: (studentData: Student) => void
): void => {
  const url = type == "student" ? "api/v1/students/login" : `api/v1/${type}/login`;
  axiosInstance
    .post(url, {
      email: data.email,
      password: data.pass,
    })
    .then((res) => {
      console.log(res.data);
      localStorage.setItem("token", res.data.data.token);
      showSuccess("Login is successful");
      callback(res.data.data);
      // return res.data.data;
    })
    .catch((err) => {
      showError(err?.response?.data || err.name + ": " + err.message);
      console.log(err);
    });
};

export const getAllStudents = async (url: string, token?: string) => {
  try {
    const res = await axiosInstance.get(url, {});
    return res.data.data.students;
  } catch (err) {
    console.log(err);
    throw err.name+": "+err.message
  }
};

export const getOneStudent = async (url: string, token?: string) => {
  try {
    const res = await axiosInstance.get(url, {});
    return res.data.data;
  } catch (err) {
    showError(err.name+": "+err.message);
    console.log(err);
  }
};


export const editStudent = async (url: string, formData) => {
  try {
    const res = await axiosInstance.patch(url, formData);
    console.log(res.data.data.student);
    
    return res.data.data.student;
  } catch (err) {
     console.log(err);
    throw err.name+": "+err.message
   
  }
};

export const deleteStudent = async (url: string) => {
  try {
    const res = await axiosInstance.delete(url);
    console.log(res.data);
    
    return res.data.data;
  } catch (err) {
    showError(err.name+": "+err.message);
    console.log(err);
  }
};

export const uploadStudents = async (url: string,formData) => {
  try {
    console.log(formData);
    
    const res = await axiosInstance.post(url,formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
     
    console.log(res.data);
    
    // return res.data.data;
  } catch (err) {
    console.log(err);
    throw err.response.data.message ;
    
  }
};


export const addStudent = async (url: string,student) => {
  try {
    const res = await axiosInstance.post(url,student)
     
    console.log(res.data);
    
    return res.data.data;
  } catch (err) {
    console.log(err);
    throw err.name+": "+err.message ;
    
  }
};





