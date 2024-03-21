import axios from 'axios';

// `import.meta.env` will put the env's value at build time into the dist
const apiHost = import.meta.env.VITE_API_HOST || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: apiHost + '/api/v1',
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
