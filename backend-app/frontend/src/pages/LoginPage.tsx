import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import AuthLayout from '../components/organisms/AuthLayout';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { login } from '../services/authService';
import { loginSchema, LoginFormData } from '../validation/authSchemas';

interface ApiError {
    message: string;
}

const LoginPage: React.FC = () => {
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setApiError('');

        try {
            const response = await login(data);
            localStorage.setItem('accessToken', response.tokens.accessToken);
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
            navigate('/dashboard');
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            setApiError(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Login" subtitle="Welcome back! Please enter your details.">
            <form onSubmit={handleSubmit(onSubmit)}>
                {apiError && <div className="error-text" style={{ marginBottom: '1rem' }}>{apiError}</div>}

                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <FormField
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <Button type="submit" isLoading={isLoading}>
                    Sign In
                </Button>
            </form>

            <div className="auth-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
            <div className="auth-link" style={{ marginTop: '0.5rem' }}>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
