import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    public details?: Record<string, unknown>;

    constructor(
        public statusCode: number,
        public message: string,
        details?: Record<string, unknown>,
        public isOperational = true
    ) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    // console.error removed due to Node.js 24 bug

    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    // Custom app errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err as any;
        if (prismaErr.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Dữ liệu đã tồn tại',
            });
        }
        if (prismaErr.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu',
            });
        }
    }

    // Default error
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Đã xảy ra lỗi hệ thống',
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Không tìm thấy endpoint: ${req.method} ${req.path}`,
    });
};
