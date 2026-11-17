import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("alzikrayat_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const imageUrl = (fileName) => `http://localhost:5000/uploads/${fileName}`;
export default api;
