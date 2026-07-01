import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Step = 'email' | 'sent' | 'error';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<Step>('email');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({ title: 'Vui lòng nhập email', variant: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In production, this would call:
            // await authApi.requestPasswordReset(email);

            setStep('sent');
            toast({ title: 'Đã gửi email khôi phục mật khẩu' });
        } catch {
            setStep('error');
            toast({ title: 'Không thể gửi email', variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                </Link>

                {/* Card */}
                <div className="bg-background-secondary border border-border rounded-2xl p-8 shadow-xl animate-fadeIn">
                    {step === 'email' && (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-primary-500" />
                                </div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-foreground-secondary">
                                    Nhập email đăng ký để nhận link khôi phục mật khẩu
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full"
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                            Đang gửi...
                                        </span>
                                    ) : (
                                        'Gửi link khôi phục'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}

                    {step === 'sent' && (
                        <div className="text-center animate-scaleIn">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Kiểm tra email của bạn
                            </h2>
                            <p className="text-foreground-secondary mb-6">
                                Chúng tôi đã gửi link khôi phục mật khẩu đến <br />
                                <span className="font-medium text-foreground">{email}</span>
                            </p>
                            <div className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setStep('email');
                                        setEmail('');
                                    }}
                                >
                                    Gửi lại email
                                </Button>
                                <Link to="/login">
                                    <Button variant="ghost" className="w-full">
                                        Quay lại đăng nhập
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center animate-scaleIn">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Có lỗi xảy ra
                            </h2>
                            <p className="text-foreground-secondary mb-6">
                                Không thể gửi email khôi phục. Vui lòng thử lại sau hoặc liên hệ quản trị viên.
                            </p>
                            <Button
                                className="w-full"
                                onClick={() => setStep('email')}
                            >
                                Thử lại
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-foreground-muted text-sm mt-6">
                    Cần hỗ trợ? Liên hệ quản trị viên của bạn
                </p>
            </div>
        </div>
    );
}
