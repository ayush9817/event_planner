import axios from "axios";

export const base_Url = "http://18.218.55.148:81/";
//export const base_Url = "https://5941-124-253-99-98.ngrok-free.app/";

const baseInstance = axios.create({
  base_Url,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default baseInstance;
