import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ✅ Cookie পাঠানোর জন্য (যদি server cookie set করে)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: simple error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  
  (error) => {
    // Optional: log errors globally
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
