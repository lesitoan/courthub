import api, { ApiResponse } from './api'

interface LoginRequest {
    email: string
    password: string
}

interface AuthResponse {
    user: {
        id: string
        email: string
        name: string
        role: string
    }
    accessToken: string
    refreshToken: string
}

export const authService = {
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
        return response.data
    },

    async register(data: LoginRequest & { name: string; phone?: string }): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
        return response.data
    },

    async logout(refreshToken?: string): Promise<void> {
        await api.post('/auth/logout', { refreshToken })
    },

    async getProfile(): Promise<ApiResponse<AuthResponse['user']>> {
        const response = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me')
        return response.data
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/change-password', { currentPassword, newPassword })
        return response.data
    },

    async logoutAllDevices(): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>('/auth/logout-all')
        return response.data
    },
}
