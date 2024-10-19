import axios from "axios";

export const axiosWithToken = axios.create({
  baseURL: 'http://localhost:4000',
});

axiosWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token); // Debugging line
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access. Token might be invalid or expired.");
      // Optionally, you can redirect to login page or refresh token here
    }
    return Promise.reject(error);
  }
);

export default axiosWithToken;