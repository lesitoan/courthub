import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        try {
            const response = await authService.login(data)
            if (response.success && response.data) {
                login(response.data.user, response.data.accessToken, response.data.refreshToken)
                toast({
                    title: 'Đăng nhập thành công',
                    description: `Chào mừng ${response.data.user.name}!`,
                    variant: 'success',
                })
                navigate('/')
            }
        } catch (error: any) {
            toast({
                title: 'Đăng nhập thất bại',
                description: error.response?.data?.message || 'Đã xảy ra lỗi',
                variant: 'error',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left - Hero */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
                    <div className="absolute bottom-40 right-20 w-96 h-96 border border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white rounded-full" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold text-white">Courtify</span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Quản lý sân cầu lông<br />chuyên nghiệp
                    </h1>
                    <p className="text-white/80 text-lg max-w-md">
                        Hệ thống toàn diện cho việc quản lý đặt sân, khách hàng,
                        thanh toán và báo cáo doanh thu.
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-12 relative z-10">
                    <div>
                        <p className="text-3xl font-bold text-white">500+</p>
                        <p className="text-white/70">Khách hàng</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">50+</p>
                        <p className="text-white/70">Sân hoạt động</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">10K+</p>
                        <p className="text-white/70">Lượt đặt sân</p>
                    </div>
                </div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-bold text-primary-500">Courtify</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Đăng nhập</h2>
                        <p className="text-foreground-secondary mt-2">
                            Nhập thông tin tài khoản để truy cập hệ thống
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@courtify.vn"
                            icon={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                icon={<Lock className="w-4 h-4" />}
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-foreground-muted hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-border bg-background-secondary text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-foreground-secondary">Ghi nhớ đăng nhập</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    {/* Demo accounts */}
                    <div className="mt-8 p-4 bg-background-secondary rounded-lg border border-border">
                        <p className="text-xs text-foreground-muted mb-2">Tài khoản demo:</p>
                        <div className="space-y-1 text-xs text-foreground-secondary">
                            <p><strong>Admin:</strong> admin@courtify.vn / admin123</p>
                            <p><strong>Manager:</strong> manager@courtify.vn / manager123</p>
                            <p><strong>Staff:</strong> staff@courtify.vn / staff123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
