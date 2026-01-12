import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import AuthLayout from '../components/organisms/AuthLayout';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { forgotPassword } from '../services/authService';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validation/authSchemas';

interface ApiError {
    message: string;
}

const ForgotPasswordPage: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setApiError('');
        setSuccess('');

        try {
            const response = await forgotPassword(data.email);
            setSuccess(response.message || 'Reset link sent! Please check your email.');
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            setApiError(error.response?.data?.message || 'Request failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link.">
            {success ? (
                <div className="success-message">
                    <p className="success-text">{success}</p>
                    <Link to="/login">
                        <Button>Back to Login</Button>
                    </Link>
                </div>
            ) : (
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

                    <Button type="submit" isLoading={isLoading}>
                        Send Reset Link
                    </Button>
                </form>
            )}
            {!success && (
                <div className="auth-link">
                    Remember your password? <Link to="/login">Login</Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
