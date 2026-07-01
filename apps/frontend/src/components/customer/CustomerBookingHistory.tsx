import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import api, { ApiResponse } from '@/services/api';
import { Booking } from '@/services/booking.service';

interface CustomerBookingHistoryProps {
    customerId: string;
    limit?: number;
}

function getStatusConfig(status: string) {
    switch (status) {
        case 'CONFIRMED':
            return { label: 'Đã xác nhận', color: 'bg-blue-500/20 text-blue-400' };
        case 'IN_PROGRESS':
            return { label: 'Đang chơi', color: 'bg-green-500/20 text-green-400' };
        case 'PENDING':
            return { label: 'Chờ xác nhận', color: 'bg-yellow-500/20 text-yellow-400' };
        case 'COMPLETED':
            return { label: 'Hoàn thành', color: 'bg-gray-500/20 text-gray-400' };
        case 'CANCELLED':
            return { label: 'Đã hủy', color: 'bg-red-500/20 text-red-400' };
        case 'NO_SHOW':
            return { label: 'Không đến', color: 'bg-orange-500/20 text-orange-400' };
        default:
            return { label: status, color: 'bg-gray-500/20 text-gray-400' };
    }
}

export function CustomerBookingHistory({ customerId, limit = 10 }: CustomerBookingHistoryProps) {
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['customer-bookings', customerId],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Booking[]>>(
                `/bookings?customerId=${customerId}&limit=${limit}&sort=date:desc`
            );
            return response.data.data || [];
        },
        enabled: !!customerId,
    });

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-background-tertiary rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-foreground-muted">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Không thể tải lịch sử đặt sân</p>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center py-8 text-foreground-muted">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Chưa có lịch sử đặt sân</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);

                return (
                    <div
                        key={booking.id}
                        className="bg-background-tertiary rounded-lg p-4 hover:bg-background-hover transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                {/* Date and status */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-foreground">
                                        {formatDate(booking.date)}
                                    </span>
                                    <span className={cn(
                                        'text-xs px-2 py-0.5 rounded-full font-medium',
                                        statusConfig.color
                                    )}>
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Time and court */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground-secondary">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{booking.startTime} - {booking.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{booking.court?.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="text-right">
                                <div className="flex items-center gap-1 font-semibold text-primary-500">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{formatCurrency(booking.totalAmount)}</span>
                                </div>
                                {booking.status === 'COMPLETED' && (
                                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Đã thanh toán</span>
                                    </div>
                                )}
                                {booking.status === 'CANCELLED' && (
                                    <div className="flex items-center gap-1 text-xs text-error mt-1">
                                        <XCircle className="w-3 h-3" />
                                        <span>Đã hủy</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
