import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, disabled, className = '', ...props }) => {
    return (
        <button
            className={`custom-button ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
