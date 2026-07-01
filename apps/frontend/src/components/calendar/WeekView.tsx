import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Booking } from '@/services/booking.service';

interface WeekViewProps {
    weekStartDate: Date;
    courts: { id: string; name: string }[];
    bookings: Booking[];
    onSlotClick: (courtId: string, date: Date, time: string) => void;
    onBookingClick: (booking: Booking) => void;
}



const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getStatusColor(status: string): string {
    switch (status) {
        case 'CONFIRMED': return 'bg-blue-500/80 hover:bg-blue-500';
        case 'IN_PROGRESS': return 'bg-green-500/80 hover:bg-green-500';
        case 'PENDING': return 'bg-yellow-500/80 hover:bg-yellow-500';
        case 'COMPLETED': return 'bg-gray-500/80 hover:bg-gray-500';
        case 'CANCELLED': return 'bg-red-500/80 hover:bg-red-500';
        default: return 'bg-gray-500/80 hover:bg-gray-500';
    }
}

function formatDateShort(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function WeekView({ weekStartDate, courts, bookings, onSlotClick, onBookingClick }: WeekViewProps) {
    // Generate 7 days starting from weekStartDate
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(weekStartDate);
            date.setDate(date.getDate() + i);
            return date;
        });
    }, [weekStartDate]);

    // Group bookings by date and court
    const bookingsByDateAndCourt = useMemo(() => {
        const map: Record<string, Record<string, Booking[]>> = {};

        bookings.forEach(booking => {
            const dateKey = new Date(booking.date).toISOString().split('T')[0];
            if (!map[dateKey]) map[dateKey] = {};
            if (!map[dateKey][booking.courtId]) map[dateKey][booking.courtId] = [];
            map[dateKey][booking.courtId].push(booking);
        });

        return map;
    }, [bookings]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="flex-1 overflow-auto">
            {/* For each court, show a week row */}
            {courts.map(court => (
                <div key={court.id} className="mb-6">
                    {/* Court header */}
                    <div className="sticky top-0 z-10 bg-background-secondary py-2 px-4 border-b border-border">
                        <h3 className="font-semibold text-foreground">{court.name}</h3>
                    </div>

                    {/* Week grid */}
                    <div className="grid grid-cols-7 gap-1 p-2">
                        {weekDays.map((date, dayIdx) => {
                            const dateKey = date.toISOString().split('T')[0];
                            const dayBookings = bookingsByDateAndCourt[dateKey]?.[court.id] || [];
                            const isToday = date.toDateString() === today.toDateString();

                            return (
                                <div
                                    key={dayIdx}
                                    className={cn(
                                        'min-h-[120px] rounded-lg border border-border p-2',
                                        isToday ? 'bg-primary-500/10 border-primary-500/50' : 'bg-background-tertiary'
                                    )}
                                >
                                    {/* Day header */}
                                    <div className="text-center mb-2 pb-2 border-b border-border">
                                        <div className={cn(
                                            'text-xs font-medium',
                                            isToday ? 'text-primary-500' : 'text-foreground-muted'
                                        )}>
                                            {WEEKDAYS[date.getDay()]}
                                        </div>
                                        <div className={cn(
                                            'text-sm font-semibold',
                                            isToday ? 'text-primary-500' : 'text-foreground'
                                        )}>
                                            {formatDateShort(date)}
                                        </div>
                                    </div>

                                    {/* Day bookings */}
                                    <div className="space-y-1">
                                        {dayBookings.length === 0 ? (
                                            <button
                                                onClick={() => onSlotClick(court.id, date, '08:00')}
                                                className="w-full text-xs text-foreground-muted py-4 rounded hover:bg-background-hover transition-colors"
                                            >
                                                + Đặt sân
                                            </button>
                                        ) : (
                                            dayBookings.map(booking => (
                                                <button
                                                    key={booking.id}
                                                    onClick={() => onBookingClick(booking)}
                                                    className={cn(
                                                        'w-full text-left px-2 py-1 rounded text-xs text-white transition-colors',
                                                        getStatusColor(booking.status)
                                                    )}
                                                >
                                                    <div className="font-medium truncate">
                                                        {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                                    </div>
                                                    <div className="truncate opacity-80">
                                                        {booking.customer?.name || 'Khách vãng lai'}
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {courts.length === 0 && (
                <div className="flex items-center justify-center h-64 text-foreground-secondary">
                    Chưa có sân nào được thiết lập
                </div>
            )}
        </div>
    );
}
