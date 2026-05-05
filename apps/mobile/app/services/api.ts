import axios from 'axios';
import authEvents from '../utils/authEvents';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setupInterceptors(
  getToken: () => string | null,
  refresh: () => Promise<void>
) {
  console.log('Setting up interceptors');
  //attach access token
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  //401 intercept
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log('Response interceptor hit', error?.response?.status);
      console.log('_retry:', error.config?._retry);
      if (error.response.status === 401 && !originalRequest._retry) {
        console.log('Attempting refresh...');
        originalRequest._retry = true;
        try {
          await refresh();
          console.log('Refresh succeeded');
          const token = getToken();
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        } catch {
          console.log('Refresh failed, emitting sessionExpired');
          authEvents.emit();
          throw error;
        }
      }
      throw error;
    }
  );
}
export default api;
