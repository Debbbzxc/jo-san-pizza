// frontend/src/config.js
export const API_URL = import.meta.env.VITE_API_URL || '';
export const UPLOADS_URL = API_URL ? `${API_URL}/uploads` : '/uploads';
