import axios from "axios";
import { showError } from "../services/toastService";

const axiosInstance=axios.create({
    baseURL:"http://localhost:4000",
    headers:{
        'Content-Type':"application/json"
    }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    showError(`Error:`)
    return Promise.reject(err);
  }
);


axiosInstance.interceptors.response.use(
    (res)=>res,
    (err)=>{
        return Promise.reject(err)
    }
)

export default axiosInstance