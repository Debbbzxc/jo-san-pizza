// frontend/src/config.js
export const API_URL = import.meta.env.VITE_API_URL || '';
export const UPLOADS_URL = API_URL ? `${API_URL}/uploads` : '/uploads';

export const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  return `${UPLOADS_URL}/${photo}`;
};
