import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const registerSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    phone: z.string().optional(),
});

const refreshSchema = z.object({
    refreshToken: z.string(),
});

// Routes
router.post('/login', async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const tokens = await authService.refreshToken(refreshToken);

        res.json({
            success: true,
            data: tokens,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/logout', authenticate, async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        await authService.logout(req.user!.userId, refreshToken);

        res.json({
            success: true,
            message: 'Đăng xuất thành công',
        });
    } catch (error) {
        next(error);
    }
});

router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user!.userId);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

router.post('/change-password', authenticate, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/logout-all', authenticate, async (req, res, next) => {
    try {
        const result = await authService.logoutAllDevices(req.user!.userId);

        res.json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
