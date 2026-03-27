import { AxiosResponse } from 'axios';
import api from './api';
interface LoginResponse {
  access: string;
}

export async function loginService(loginCredentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/auth/login',
      { ...loginCredentials },
      { withCredentials: true }
    );

    //save token somewhere maybe like local storage or session or somewhere with context
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}

export async function registerService(registerCredentials: {
  email: string;
  password: string;
}): Promise<void> {
  try {
    await api.post('/auth/register', { ...registerCredentials });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}

export async function refreshAccessService(): Promise<LoginResponse> {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/auth/refresh',
      {},
      { withCredentials: true }
    );
    return { access: response.data.access };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}
