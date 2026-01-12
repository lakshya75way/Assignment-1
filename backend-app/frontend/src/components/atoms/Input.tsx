import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, className = '', ...props }, ref) => {
        return (
            <div className="input-wrapper">
                <input
                    ref={ref}
                    className={`custom-input ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && <span className="error-text">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
