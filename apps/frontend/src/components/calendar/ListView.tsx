import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, XCircle, Play, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Booking } from '@/services/booking.service';

interface ListViewProps {
    bookings: Booking[];
    onBookingClick: (booking: Booking) => void;
}

function getStatusConfig(status: string) {
    switch (status) {
        case 'CONFIRMED':
            return { label: 'Đã xác nhận', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircle };
        case 'IN_PROGRESS':
            return { label: 'Đang chơi', color: 'bg-green-500/20 text-green-400', icon: Play };
        case 'PENDING':
            return { label: 'Chờ xác nhận', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle };
        case 'COMPLETED':
            return { label: 'Hoàn thành', color: 'bg-gray-500/20 text-gray-400', icon: CheckCircle };
        case 'CANCELLED':
            return { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400', icon: XCircle };
        default:
            return { label: status, color: 'bg-gray-500/20 text-gray-400', icon: AlertCircle };
    }
}

export function ListView({ bookings, onBookingClick }: ListViewProps) {
    // Group bookings by time
    const sortedBookings = [...bookings].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });

    if (sortedBookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-foreground-secondary">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Không có lịch đặt</p>
                <p className="text-sm">Chưa có lịch đặt nào trong ngày này</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {sortedBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;

                return (
                    <div
                        key={booking.id}
                        onClick={() => onBookingClick(booking)}
                        className="bg-background-tertiary hover:bg-background-hover rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg border border-transparent hover:border-border"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {/* Left side - main info */}
                            <div className="flex-1 min-w-0">
                                {/* Time and status */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                                        <Clock className="w-4 h-4 text-foreground-muted" />
                                        <span>{booking.startTime} - {booking.endTime}</span>
                                    </div>
                                    <span className={cn(
                                        'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
                                        statusConfig.color
                                    )}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Court info */}
                                <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{booking.court?.name}</span>
                                </div>

                                {/* Customer info */}
                                {booking.customer ? (
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                                            <span className="text-primary-500 text-xs font-medium">
                                                {booking.customer.name.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="text-foreground">{booking.customer.name}</span>
                                        <span className="text-foreground-muted">•</span>
                                        <span className="text-foreground-secondary">{booking.customer.phone}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                                        <User className="w-4 h-4" />
                                        <span>Khách vãng lai</span>
                                    </div>
                                )}
                            </div>

                            {/* Right side - price */}
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-lg font-bold text-primary-500">
                                    <DollarSign className="w-4 h-4" />
                                    {formatCurrency(booking.totalAmount)}
                                </div>
                                {booking.isRecurring && (
                                    <span className="text-xs text-purple-400">
                                        Lịch cố định
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                            <p className="mt-2 text-sm text-foreground-secondary italic line-clamp-1">
                                {booking.notes}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
