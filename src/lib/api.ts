import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  maxRedirects: 2,
  transformRequest: [
    (data, header) => {
      const token = localStorage.getItem('token');
      header.set('Content-Type', 'application/json; charset=utf-8');
      if (token) header.set('Authorization', `Bearer ${token}`);
      return data;
    }
  ]
});
