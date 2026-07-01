import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = useAuthStore.getState().refreshToken

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken,
                    })

                    const { accessToken, refreshToken: newRefreshToken } = response.data.data
                    useAuthStore.getState().updateTokens(accessToken, newRefreshToken)

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return api(originalRequest)
                } catch {
                    // Refresh failed, logout
                    useAuthStore.getState().logout()
                    window.location.href = '/login'
                }
            } else {
                useAuthStore.getState().logout()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

// API response type
export interface ApiResponse<T> {
    success: boolean
    message?: string
    data?: T
    errors?: Array<{ field: string; message: string }>
}

export default api
