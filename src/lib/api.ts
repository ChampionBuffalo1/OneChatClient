import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  maxRedirects: 2
});
