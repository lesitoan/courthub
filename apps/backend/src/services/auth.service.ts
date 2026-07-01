import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';
import { JwtPayload, UserRole } from '../middleware/auth.js';

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    private generateTokens(payload: JwtPayload) {
        const accessToken = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
        });

        const refreshToken = jwt.sign(
            { userId: payload.userId },
            config.jwt.refreshSecret,
            { expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'] }
        );

        return { accessToken, refreshToken };
    }

    async login(input: LoginInput): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            throw new AppError(401, 'Email hoặc mật khẩu không đúng');
        }

        if (!user.isActive) {
            throw new AppError(401, 'Tài khoản đã bị vô hiệu hóa');
        }

        const validPassword = await bcrypt.compare(input.password, user.passwordHash);
        if (!validPassword) {
            throw new AppError(401, 'Email hoặc mật khẩu không đúng');
        }

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as UserRole,
        };

        const { accessToken, refreshToken } = this.generateTokens(payload);

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    async register(input: RegisterInput): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new AppError(409, 'Email đã được sử dụng');
        }

        const passwordHash = await bcrypt.hash(input.password, 12);

        const user = await prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                name: input.name,
                phone: input.phone,
                role: 'STAFF', // Default role
            },
        });

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role as UserRole,
        };

        const { accessToken, refreshToken } = this.generateTokens(payload);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
        // Verify refresh token
        let decoded: { userId: string };
        try {
            decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
        } catch {
            throw new AppError(401, 'Refresh token không hợp lệ');
        }

        // Check token in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new AppError(401, 'Refresh token đã hết hạn');
        }

        if (!storedToken.user.isActive) {
            throw new AppError(401, 'Tài khoản đã bị vô hiệu hóa');
        }

        // Delete old refresh token
        await prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });

        // Generate new tokens
        const payload: JwtPayload = {
            userId: storedToken.user.id,
            email: storedToken.user.email,
            role: storedToken.user.role as UserRole,
        };

        const tokens = this.generateTokens(payload);

        // Store new refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: storedToken.user.id,
                expiresAt,
            },
        });

        return tokens;
    }

    async logout(userId: string, refreshToken?: string) {
        if (refreshToken) {
            // Delete specific refresh token
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        } else {
            // Delete all refresh tokens for user
            await prisma.refreshToken.deleteMany({
                where: { userId },
            });
        }
    }

    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                role: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new AppError(404, 'Không tìm thấy người dùng');
        }

        return user;
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(404, 'Không tìm thấy người dùng');
        }

        const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!validPassword) {
            throw new AppError(400, 'Mật khẩu hiện tại không đúng');
        }

        if (newPassword.length < 6) {
            throw new AppError(400, 'Mật khẩu mới phải có ít nhất 6 ký tự');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });

        // Delete all refresh tokens to force re-login
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });

        return { message: 'Đổi mật khẩu thành công' };
    }

    async logoutAllDevices(userId: string) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
        return { message: 'Đã đăng xuất khỏi tất cả thiết bị' };
    }
}

export const authService = new AuthService();
