import axios from 'axios';

let baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

// Detect browser environment and adjust API URL if necessary
if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing via IP but API is set to localhost, or vice versa, swap them to match
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && baseURL.includes('localhost')) {
        baseURL = `http://${hostname}:3001/api`;
    } else if ((hostname === 'localhost' || hostname === '127.0.0.1') && !baseURL.includes('localhost')) {
        baseURL = 'http://localhost:3001/api';
    }
}

const api = axios.create({
    baseURL,
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
