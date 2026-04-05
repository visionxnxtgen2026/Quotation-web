import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Unga backend URL
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Profile Update pandra API call (Handles Multipart for images)
export const updateProfile = (formData) => 
  API.put("/auth/user/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default API;