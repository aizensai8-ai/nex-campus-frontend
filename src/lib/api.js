import axios from 'axios';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const api = axios.create({
  // Use relative path to leverage Vite's proxy so Ngrok tunnels both cleanly
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: false,
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap { success: true, data: X } → res.data becomes X
// Leave auth responses ({ token, user } with no `data` key) untouched
api.interceptors.response.use(
  (res) => {
    if (res.data?.success === true && 'data' in res.data) {
      return { ...res, data: res.data.data };
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      clearStoredToken();
    }
    return Promise.reject(err);
  }
);

export default api;
