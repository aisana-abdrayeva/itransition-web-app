import axios from "axios";

const api = axios.create({
    baseURL: "https://itransition-web-app.onrender.com/api", 
    withCredentials: true, 
});

export default api;
