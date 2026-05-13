// Central API URL resolver — import this in every component instead of repeating the inline fallback.
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = rawUrl.replace(/\/$/, '');
