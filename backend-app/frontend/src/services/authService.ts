import api from './api';
import {
    LoginCredentials,
    SignupCredentials,
    ResetPasswordData,
    ChangePasswordData,
    AuthResponse
} from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const signup = async (credentials: SignupCredentials): Promise<{ message: string }> => {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
    const response = await api.post(`/auth/verify/${token}`);
    return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token: string, data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post(`/auth/reset/${token}`, data);
    return response.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
};

export const logout = async (refreshToken: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
};
