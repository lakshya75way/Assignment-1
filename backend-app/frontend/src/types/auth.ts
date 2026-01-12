export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface SignupCredentials {
    email: string;
    password?: string;
}

export interface ResetPasswordData {
    password?: string;
}

export interface ChangePasswordData {
    oldPassword?: string;
    newPassword?: string;
}

export interface AuthResponse {
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface User {
    id: string;
    email: string;
}
