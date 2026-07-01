import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Check, Clock, Copy, Home, Phone, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { publicBookingApi } from '@/services/public-booking.service';

const STATUS_LABELS = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    IN_PROGRESS: 'Đang chơi',
    COMPLETED: 'Đã chơi',
    CANCELLED: 'Đã hủy',
    NO_SHOW: 'Không đến',
};

function getStatusConfig(status: keyof typeof STATUS_LABELS) {
    const configs = {
        PENDING: {
            icon: Clock,
            title: 'Đang chờ xác nhận',
            description: 'Lịch của bạn đã được ghi nhận. Sân sẽ liên hệ nếu cần xác nhận thêm.',
            panelClass: 'border-warning/30 bg-gradient-to-br from-warning/15 to-background-secondary',
            iconClass: 'bg-warning text-background',
        },
        CONFIRMED: {
            icon: Check,
            title: 'Đã xác nhận lịch',
            description: 'Lịch đặt sân của bạn đã được xác nhận.',
            panelClass: 'border-primary-500/30 bg-gradient-to-br from-primary-500/15 to-background-secondary',
            iconClass: 'bg-primary-500 text-white',
        },
        IN_PROGRESS: {
            icon: Clock,
            title: 'Đang chơi',
            description: 'Lịch đặt sân đang trong thời gian sử dụng.',
            panelClass: 'border-info/30 bg-gradient-to-br from-info/15 to-background-secondary',
            iconClass: 'bg-info text-white',
        },
        COMPLETED: {
            icon: Check,
            title: 'Đã hoàn thành',
            description: 'Lịch đặt sân đã hoàn tất.',
            panelClass: 'border-primary-500/30 bg-gradient-to-br from-primary-500/15 to-background-secondary',
            iconClass: 'bg-primary-500 text-white',
        },
        CANCELLED: {
            icon: XCircle,
            title: 'Lịch đã hủy',
            description: 'Lịch đặt sân này đã được hủy và không còn hiệu lực.',
            panelClass: 'border-error/40 bg-gradient-to-br from-error/20 to-background-secondary',
            iconClass: 'bg-error text-white',
        },
        NO_SHOW: {
            icon: AlertTriangle,
            title: 'Không đến sân',
            description: 'Lịch này được ghi nhận là khách không đến sân.',
            panelClass: 'border-error/40 bg-gradient-to-br from-error/20 to-background-secondary',
            iconClass: 'bg-error text-white',
        },
    };

    return configs[status] || configs.PENDING;
}

export default function ClientBookingSuccessPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading } = useQuery({
        queryKey: ['public', 'booking', id],
        queryFn: () => publicBookingApi.getBooking(id!),
        enabled: !!id,
    });

    if (isLoading || !booking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div 
            className="min-h-screen bg-background px-4 py-8 text-foreground"
            style={{
                backgroundImage: 'url("/bg-client.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="mx-auto max-w-2xl">
                <div className={cn('rounded-2xl border p-6 text-center', statusConfig.panelClass)}>
                    <div className={cn('mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-glow', statusConfig.iconClass)}>
                        <StatusIcon className="h-10 w-10" />
                    </div>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
                        {STATUS_LABELS[booking.status] || booking.status}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">{statusConfig.title}</h1>
                    <p className="mt-2 text-foreground-secondary">
                        {statusConfig.description}
                    </p>
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-background-secondary p-5">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-background-tertiary p-4">
                        <div>
                            <p className="text-sm text-foreground-secondary">Mã đặt sân</p>
                            <p className="mt-1 font-mono text-xl font-bold">{booking.bookingCode}</p>
                        </div>
                        <button
                            onClick={() => navigator.clipboard?.writeText(booking.bookingCode)}
                            className="rounded-lg p-2 hover:bg-background-hover"
                            title="Sao chép"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                        <Info label="Trạng thái" value={STATUS_LABELS[booking.status] || booking.status} />
                        <Info label="Khách hàng" value={`${booking.customer?.name || '-'} · ${booking.customer?.phone || ''}`} />
                        <Info label="Cơ sở" value={booking.court.venue.name} />
                        <Info label="Sân" value={booking.court.name} />
                        <Info label="Thời gian" value={`${formatDate(booking.date)} · ${booking.startTime} - ${booking.endTime}`} />
                    </div>

                    {booking.addons.length > 0 && (
                        <div className="mt-5 rounded-xl bg-background-tertiary p-4">
                            <p className="mb-3 font-semibold">Dịch vụ & sản phẩm đặt kèm</p>
                            <div className="space-y-2 text-sm">
                                {booking.addons.map(addon => (
                                    <div key={`${addon.type}:${addon.id}`} className="flex justify-between gap-3">
                                        <span className="text-foreground-secondary">{addon.name} x{addon.quantity}</span>
                                        <span>{formatCurrency(addon.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                        Bạn có thể đổi hoặc hủy lịch trước giờ chơi tối thiểu 2 giờ. Điểm sẽ được cộng sau khi hoàn tất/thanh toán.
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                        <span className="font-semibold">Tổng tiền tạm tính</span>
                        <span className="text-2xl font-bold text-primary-500">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    <p className="mt-1 text-right text-sm text-foreground-secondary">Dự kiến nhận {booking.estimatedPoints} điểm</p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Button onClick={() => navigate(`/booking/${booking.id}`)}>Xem chi tiết</Button>
                    <Button variant="secondary" onClick={() => navigate('/booking-lookup')} className="gap-2">
                        <Search className="h-4 w-4" />
                        Tra cứu lịch
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/book')} className="gap-2">
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Button>
                </div>

                <Button variant="ghost" className="mt-3 w-full gap-2">
                    <Phone className="h-4 w-4" />
                    Gọi sân
                </Button>
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-foreground-secondary">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}
