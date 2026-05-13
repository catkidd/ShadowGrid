// Central API URL resolver — import this in every component instead of repeating the inline fallback.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
