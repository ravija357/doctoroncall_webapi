import api from '../services/api';

export const getImageUrl = (path: string | null | undefined, seed?: string, updatedAt?: string) => {
    if (!path) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed || 'default'}`;
    if (path.startsWith('http')) return path;

    const apiUrl = api.defaults.baseURL?.replace('/api', '') || 'http://localhost:3001';
    const baseUrl = `${apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    return updatedAt ? `${baseUrl}?v=${new Date(updatedAt).getTime()}` : baseUrl;
};
