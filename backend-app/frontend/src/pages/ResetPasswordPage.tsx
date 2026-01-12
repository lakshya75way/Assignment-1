import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import AuthLayout from '../components/organisms/AuthLayout';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { resetPassword } from '../services/authService';
import { resetPasswordSchema, ResetPasswordFormData } from '../validation/authSchemas';

interface ApiError {
    message: string;
}

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [success, setSuccess] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setApiError('');
        setSuccess('');

        try {
            if (!token) throw new Error('Invalid token');
            const response = await resetPassword(token, { password: data.password });
            setSuccess(response.message || 'Password reset successful!');
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            setApiError(error.response?.data?.message || 'Reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Choose a new secure password.">
            {success ? (
                <div className="success-message">
                    <p className="success-text">{success}</p>
                    <Link to="/login">
                        <Button>Login Now</Button>
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {apiError && <div className="error-text" style={{ marginBottom: '1rem' }}>{apiError}</div>}

                    <FormField
                        label="New Password"
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <FormField
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />

                    <Button type="submit" isLoading={isLoading}>
                        Update Password
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordPage;
