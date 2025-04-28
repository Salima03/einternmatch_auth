import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:1217/api/v1',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Token JWT stocké après login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
