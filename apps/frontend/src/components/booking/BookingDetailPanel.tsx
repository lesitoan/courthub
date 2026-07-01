import {
    X,
    User,
    Phone,
    Calendar,
    Clock,
    MapPin,
    DollarSign,
    CheckCircle,
    XCircle,
    Play,
    AlertCircle,
    Repeat,
    Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Booking } from '@/services/booking.service';

interface BookingDetailPanelProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onCheckIn: (id: string) => void;
    onCheckOut: (id: string) => void;
    onCancel: (id: string) => void;
    onEdit?: (booking: Booking) => void;
    isLoading?: boolean;
}

function getStatusConfig(status: string) {
    switch (status) {
        case 'CONFIRMED':
            return { label: 'Đã xác nhận', color: 'text-blue-400 bg-blue-500/20', icon: CheckCircle };
        case 'IN_PROGRESS':
            return { label: 'Đang chơi', color: 'text-green-400 bg-green-500/20', icon: Play };
        case 'PENDING':
            return { label: 'Chờ xác nhận', color: 'text-yellow-400 bg-yellow-500/20', icon: AlertCircle };
        case 'COMPLETED':
            return { label: 'Hoàn thành', color: 'text-gray-400 bg-gray-500/20', icon: CheckCircle };
        case 'CANCELLED':
            return { label: 'Đã hủy', color: 'text-red-400 bg-red-500/20', icon: XCircle };
        default:
            return { label: status, color: 'text-gray-400 bg-gray-500/20', icon: AlertCircle };
    }
}

export function BookingDetailPanel({
    booking,
    isOpen,
    onClose,
    onCheckIn,
    onCheckOut,
    onCancel,
    onEdit,
    isLoading = false,
}: BookingDetailPanelProps) {
    if (!booking) return null;

    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;

    const canCheckIn = booking.status === 'CONFIRMED' || booking.status === 'PENDING';
    const canCheckOut = booking.status === 'IN_PROGRESS';
    const canCancel = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
    const canEdit = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && booking.status !== 'IN_PROGRESS';

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    'fixed right-0 top-0 h-full w-full max-w-md bg-background-secondary border-l border-border z-50 transition-transform duration-300 overflow-y-auto',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="sticky top-0 bg-background-secondary z-10 flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Chi tiết đặt sân</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground-secondary" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Status badge */}
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg w-fit',
                        statusConfig.color
                    )}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-medium">{statusConfig.label}</span>
                    </div>

                    {/* Recurring badge */}
                    {booking.isRecurring && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 w-fit">
                            <Repeat className="w-4 h-4" />
                            <span className="text-sm font-medium">Lịch cố định</span>
                        </div>
                    )}

                    {/* Customer info */}
                    <div className="bg-background-tertiary rounded-xl p-4">
                        <h3 className="text-sm font-medium text-foreground-secondary mb-3">
                            Thông tin khách hàng
                        </h3>
                        {booking.customer ? (
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                    <span className="text-primary-500 font-semibold text-lg">
                                        {booking.customer.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {booking.customer.name}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-foreground-secondary mt-1">
                                        <Phone className="w-3 h-3" />
                                        {booking.customer.phone}
                                    </div>
                                    {booking.customer.membershipTier && (
                                        <span className={cn(
                                            'inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium',
                                            booking.customer.membershipTier === 'PLATINUM' ? 'bg-purple-500/20 text-purple-400' :
                                                booking.customer.membershipTier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    booking.customer.membershipTier === 'SILVER' ? 'bg-gray-400/20 text-gray-300' :
                                                        'bg-orange-500/20 text-orange-400'
                                        )}>
                                            {booking.customer.membershipTier}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-foreground-secondary">
                                <User className="w-5 h-5" />
                                <span>Khách vãng lai</span>
                            </div>
                        )}
                    </div>

                    {/* Booking details */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground-secondary">
                            Chi tiết đặt sân
                        </h3>

                        <div className="bg-background-tertiary rounded-xl divide-y divide-border">
                            <div className="flex items-center gap-3 p-3">
                                <MapPin className="w-5 h-5 text-foreground-muted" />
                                <div>
                                    <p className="text-sm text-foreground-secondary">Sân</p>
                                    <p className="font-medium text-foreground">{booking.court?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3">
                                <Calendar className="w-5 h-5 text-foreground-muted" />
                                <div>
                                    <p className="text-sm text-foreground-secondary">Ngày</p>
                                    <p className="font-medium text-foreground">{formatDate(booking.date)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3">
                                <Clock className="w-5 h-5 text-foreground-muted" />
                                <div>
                                    <p className="text-sm text-foreground-secondary">Giờ</p>
                                    <p className="font-medium text-foreground">
                                        {booking.startTime} - {booking.endTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3">
                                <DollarSign className="w-5 h-5 text-foreground-muted" />
                                <div>
                                    <p className="text-sm text-foreground-secondary">Thành tiền</p>
                                    <p className="font-semibold text-primary-500 text-lg">
                                        {formatCurrency(booking.totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div>
                            <h3 className="text-sm font-medium text-foreground-secondary mb-2">
                                Ghi chú
                            </h3>
                            <p className="text-sm text-foreground bg-background-tertiary rounded-lg p-3">
                                {booking.notes}
                            </p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <h3 className="text-sm font-medium text-foreground-secondary mb-3">
                            Lịch sử
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-sm text-foreground-secondary">
                                    Tạo lúc {new Date(booking.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                            {booking.checkedInAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm text-foreground-secondary">
                                        Check-in lúc {new Date(booking.checkedInAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            )}
                            {booking.checkedOutAt && (
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                                    <span className="text-sm text-foreground-secondary">
                                        Check-out lúc {new Date(booking.checkedOutAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t border-border">
                        {canCheckIn && (
                            <Button
                                className="w-full"
                                onClick={() => onCheckIn(booking.id)}
                                isLoading={isLoading}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Check-in
                            </Button>
                        )}

                        {canCheckOut && (
                            <Button
                                className="w-full"
                                onClick={() => onCheckOut(booking.id)}
                                isLoading={isLoading}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Check-out & Thanh toán
                            </Button>
                        )}

                        {canEdit && onEdit && (
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => onEdit(booking)}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Chỉnh sửa
                            </Button>
                        )}

                        {canCancel && (
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => onCancel(booking.id)}
                                isLoading={isLoading}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Hủy đặt sân
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
