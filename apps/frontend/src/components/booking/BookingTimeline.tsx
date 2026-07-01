import { Clock, User, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type BookingTimelineStatus = 'upcoming' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

interface TimelineBooking {
    id: string;
    time: string;
    endTime: string;
    customerName: string;
    customerPhone?: string;
    courtName: string;
    status: BookingTimelineStatus;
    amount: number;
    isRecurring?: boolean;
}

interface BookingTimelineProps {
    bookings: TimelineBooking[];
    onBookingClick?: (bookingId: string) => void;
    onCheckIn?: (bookingId: string) => void;
    showActions?: boolean;
    maxItems?: number;
}

const STATUS_CONFIG = {
    'upcoming': {
        label: 'Sắp tới',
        icon: Clock,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
        dotColor: 'bg-blue-500',
    },
    'in-progress': {
        label: 'Đang chơi',
        icon: AlertCircle,
        color: 'text-green-500 bg-green-500/10 border-green-500/30',
        dotColor: 'bg-green-500 animate-pulse',
    },
    'completed': {
        label: 'Hoàn thành',
        icon: CheckCircle,
        color: 'text-foreground-muted bg-background-tertiary border-border',
        dotColor: 'bg-foreground-muted',
    },
    'cancelled': {
        label: 'Đã hủy',
        icon: XCircle,
        color: 'text-red-500 bg-red-500/10 border-red-500/30',
        dotColor: 'bg-red-500',
    },
    'no-show': {
        label: 'Vắng mặt',
        icon: XCircle,
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
        dotColor: 'bg-orange-500',
    },
};

export function BookingTimeline({
    bookings,
    onBookingClick,
    onCheckIn,
    showActions = true,
    maxItems,
}: BookingTimelineProps) {
    const displayBookings = maxItems ? bookings.slice(0, maxItems) : bookings;

    if (bookings.length === 0) {
        return (
            <div className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 text-foreground-muted opacity-30" />
                <p className="text-foreground-secondary">Không có lịch đặt</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

            {/* Bookings */}
            <div className="space-y-4">
                {displayBookings.map((booking) => {
                    const config = STATUS_CONFIG[booking.status];
                    const StatusIcon = config.icon;

                    return (
                        <div
                            key={booking.id}
                            className="relative flex gap-4"
                        >
                            {/* Timeline dot */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background-secondary',
                                    booking.status === 'in-progress' ? 'border-green-500' : 'border-border'
                                )}>
                                    <span className={cn('w-3 h-3 rounded-full', config.dotColor)} />
                                </div>
                            </div>

                            {/* Content */}
                            <button
                                onClick={() => onBookingClick?.(booking.id)}
                                className={cn(
                                    'flex-1 p-4 rounded-xl border text-left transition-all hover:shadow-md',
                                    config.color
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Time */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg font-bold">{booking.time}</span>
                                            <ArrowRight className="w-4 h-4 opacity-50" />
                                            <span className="text-lg font-bold">{booking.endTime}</span>
                                            {booking.isRecurring && (
                                                <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-500 rounded-full">
                                                    Cố định
                                                </span>
                                            )}
                                        </div>

                                        {/* Customer */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="w-4 h-4 opacity-60" />
                                            <span className="font-medium truncate">{booking.customerName}</span>
                                            {booking.customerPhone && (
                                                <span className="text-sm opacity-60">({booking.customerPhone})</span>
                                            )}
                                        </div>

                                        {/* Court */}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 opacity-60" />
                                            <span>{booking.courtName}</span>
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold">{formatCurrency(booking.amount)}</p>
                                        <span className={cn(
                                            'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1',
                                            config.color
                                        )}>
                                            <StatusIcon className="w-3 h-3" />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                {showActions && booking.status === 'upcoming' && onCheckIn && (
                                    <div className="mt-3 pt-3 border-t border-current/10">
                                        <Button
                                            size="sm"
                                            className="gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCheckIn(booking.id);
                                            }}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Check-in
                                        </Button>
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Show more */}
            {maxItems && bookings.length > maxItems && (
                <div className="mt-4 text-center">
                    <Button variant="ghost" className="gap-2">
                        Xem thêm {bookings.length - maxItems} lịch đặt
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
