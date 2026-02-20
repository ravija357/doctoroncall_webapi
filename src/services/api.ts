import axios from 'axios';

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) globally -> Redirect to login?
        // For now just reject
        return Promise.reject(error);
    }
);

export default api;
