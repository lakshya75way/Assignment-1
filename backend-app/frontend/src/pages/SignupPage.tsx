import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import AuthLayout from '../components/organisms/AuthLayout';
import FormField from '../components/molecules/FormField';
import Button from '../components/atoms/Button';
import { signup } from '../services/authService';
import { signupSchema, SignupFormData } from '../validation/authSchemas';

interface ApiError {
    message: string;
}

const SignupPage: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setApiError('');
        setSuccess('');

        try {
            const response = await signup({ email: data.email, password: data.password });
            setSuccess(response.message || 'Signup successful! Please check your email.');
        } catch (err) {
            const error = err as AxiosError<ApiError>;
            setApiError(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account">
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

                    <FormField
                        label="Password"
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
                        Sign Up
                    </Button>
                </form>
            )}
            {!success && (
                <div className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default SignupPage;
