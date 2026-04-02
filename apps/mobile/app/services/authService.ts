import { AxiosResponse } from 'axios';
import api from './api';
interface accessToken {
  access: string;
}

export async function loginService(
  email: string,
  password: string
): Promise<accessToken> {
  try {
    console.log('hitting login endpoint');
    const response: AxiosResponse<accessToken> = await api.post(
      '/auth/login',
      { email: email, password: password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}

export async function registerService(
  email: string,
  password: string
): Promise<void> {
  try {
    console.log('hitting register endpoint');
    await api.post(
      '/auth/register',
      { email: email, password: password },
      { withCredentials: true }
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}

export async function refreshAccessService(): Promise<accessToken> {
  try {
    const response: AxiosResponse<accessToken> = await api.post(
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

export async function logoutService(): Promise<void> {
  try {
    const response: AxiosResponse = await api.post(
      '/auth/logout',
      {},
      { withCredentials: true }
    );
    console.log(response);
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
}
