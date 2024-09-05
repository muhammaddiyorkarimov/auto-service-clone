import axios from 'axios';

// Base URL
const API_URL = 'https://api.davrmotors.fassco.uz/';

// Create an instance of axios
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to add the token to the headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
