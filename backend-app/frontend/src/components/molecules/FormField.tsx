import React, { forwardRef } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, id, error, ...props }, ref) => {
        return (
            <div className="form-group">
                {id && <Label htmlFor={id}>{label}</Label>}
                <Input
                    ref={ref}
                    id={id}
                    error={error}
                    {...props}
                />
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;
