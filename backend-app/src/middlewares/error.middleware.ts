import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';


export interface ValidationError {
    field: string;
    message: string;
}

export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errors?: ValidationError[];

    constructor(message: string, statusCode: number, errors?: ValidationError[]) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        if (errors) this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}


export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};


const handleZodError = (err: ZodError) => {
    const errors: ValidationError[] = err.issues.map((issue) => {
        const field = issue.path.join('.');
        let message = issue.message;

        if (message.includes('expected string, received undefined')) {
            message = 'Required';
        }

        return { field, message };
    });

    return new AppError('Validation failed', 400, errors);
};

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        errors: err.errors,
        stack: err.stack,
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors
        });
    } else {

        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};


export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;
        error.errors = err.errors;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err instanceof ZodError) error = handleZodError(err);
        if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token. Please log in again!', 401);
        if (err.name === 'TokenExpiredError') error = new AppError('Your token has expired! Please log in again.', 401);

        sendErrorProd(error, res);
    }
};
