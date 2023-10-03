import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  maxRedirects: 2
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
