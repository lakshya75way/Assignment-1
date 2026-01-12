import React, { useState } from 'react';
import { } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import AuthLayout from '../components/organisms/AuthLayout';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { changePassword } from '../services/authService';
import { changePasswordSchema, ChangePasswordFormData } from '../validation/authSchemas';

interface ApiError {
    message: string;
}

const ChangePasswordPage: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);
        setApiError('');
        setSuccess('');

        try {
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            });
            setSuccess('pass updated doe! Redirecting to login...');

            setTimeout(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }, 3000);

        } catch (err) {
            const error = err as AxiosError<ApiError>;
            setApiError(error.response?.data?.message || 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Change Password" subtitle="Strictly secure your account.">
            {success ? (
                <div className="success-message">
                    <p className="success-text">{success}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {apiError && <div className="error-text" style={{ marginBottom: '1rem' }}>{apiError}</div>}

                    <FormField
                        label="Old Password"
                        id="oldPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register('oldPassword')}
                        error={errors.oldPassword?.message}
                    />

                    <FormField
                        label="New Password"
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register('newPassword')}
                        error={errors.newPassword?.message}
                    />

                    <FormField
                        label="Confirm New Password"
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

export default ChangePasswordPage;
