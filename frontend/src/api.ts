import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true, 
});
// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');  
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage');
            console.log('Request URL:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
