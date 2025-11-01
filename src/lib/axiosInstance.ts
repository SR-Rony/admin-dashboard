import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ✅ Cookie পাঠানোর জন্য
});

// Auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/auth/refresh-token"); // refresh token call
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
