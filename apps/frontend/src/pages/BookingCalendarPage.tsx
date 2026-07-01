import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Repeat
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { bookingApi, Booking } from '@/services/booking.service';
import { venueApi, Venue } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { ViewToggle, CalendarViewMode, MiniCalendar, WeekView, ListView } from '@/components/calendar';
import { RecurringBookingModal, BookingDetailPanel, NewBookingModal, EditBookingModal } from '@/components/booking';
import { recurringBookingApi, RecurringBookingInput } from '@/services/recurring-booking.service';

// Time slots from 6:00 to 23:00
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
});

interface BookingSlot {
    booking: Booking;
    gridRow: number;
    gridRowSpan: number;
}

function getBookingSlot(booking: Booking): BookingSlot {
    const [startH, startM] = booking.startTime.split(':').map(Number);
    const [endH, endM] = booking.endTime.split(':').map(Number);

    const startRow = (startH - 6) * 2 + Math.floor(startM / 30) + 2; // +2 for header
    const endRow = (endH - 6) * 2 + Math.floor(endM / 30) + 2;

    return {
        booking,
        gridRow: startRow,
        gridRowSpan: Math.max(endRow - startRow, 1),
    };
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'CONFIRMED': return 'bg-blue-500/20 border-blue-500 text-blue-400';
        case 'IN_PROGRESS': return 'bg-green-500/20 border-green-500 text-green-400';
        case 'PENDING': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
        case 'COMPLETED': return 'bg-gray-500/20 border-gray-500 text-gray-400';
        case 'CANCELLED': return 'bg-red-500/20 border-red-500 text-red-400';
        default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
}

function getStatusLabel(status: string): string {
    switch (status) {
        case 'CONFIRMED': return 'Đã xác nhận';
        case 'IN_PROGRESS': return 'Đang chơi';
        case 'PENDING': return 'Chờ xác nhận';
        case 'COMPLETED': return 'Hoàn thành';
        case 'CANCELLED': return 'Đã hủy';
        default: return status;
    }
}

export default function BookingCalendarPage() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
    const [showRecurringModal, setShowRecurringModal] = useState(false);
    const [showNewBookingModal, setShowNewBookingModal] = useState(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch venues
    const { data: venuesData } = useQuery({
        queryKey: ['venues'],
        queryFn: () => venueApi.getAll({ isActive: true }),
    });

    // Set first venue as default
    useEffect(() => {
        if (venuesData?.data && venuesData.data.length > 0 && !selectedVenueId) {
            setSelectedVenueId(venuesData.data[0].id);
        }
    }, [venuesData, selectedVenueId]);

    // Fetch calendar data
    const { data: calendarData, isLoading } = useQuery({
        queryKey: ['calendar', selectedVenueId, selectedDate.toISOString().split('T')[0]],
        queryFn: () => bookingApi.getCalendarData(
            selectedVenueId,
            selectedDate.toISOString().split('T')[0],
            selectedDate.toISOString().split('T')[0]
        ),
        enabled: !!selectedVenueId,
    });

    // Check-in mutation
    const checkInMutation = useMutation({
        mutationFn: (id: string) => bookingApi.checkIn(id),
        onSuccess: () => {
            toast({ title: 'Check-in thành công!' });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setSelectedBooking(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi check-in', variant: 'error' });
        },
    });

    // Check-out mutation
    const checkOutMutation = useMutation({
        mutationFn: (id: string) => bookingApi.checkOut(id),
        onSuccess: () => {
            toast({ title: 'Check-out thành công!' });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setSelectedBooking(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi check-out', variant: 'error' });
        },
    });

    // Cancel mutation
    const cancelMutation = useMutation({
        mutationFn: (id: string) => bookingApi.cancel(id),
        onSuccess: () => {
            toast({ title: 'Đã hủy lịch đặt!' });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setSelectedBooking(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi hủy', variant: 'error' });
        },
    });

    // Navigate dates
    const goToPreviousDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        setSelectedDate(prev);
    };

    const goToNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
    };

    const goToToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setSelectedDate(today);
    };

    // Process bookings for grid layout
    const bookingsByCourtId = useMemo(() => {
        if (!calendarData?.bookings) return {};

        const map: Record<string, BookingSlot[]> = {};
        calendarData.bookings.forEach(booking => {
            if (!map[booking.courtId]) map[booking.courtId] = [];
            map[booking.courtId].push(getBookingSlot(booking));
        });
        return map;
    }, [calendarData]);

    const isToday = selectedDate.toDateString() === new Date().toDateString();

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Lịch Đặt Sân</h1>
                    <p className="text-foreground-secondary">Quản lý lịch đặt sân theo ngày</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="secondary" className="gap-2" onClick={() => setShowRecurringModal(true)}>
                        <Repeat className="w-4 h-4" />
                        <span className="hidden sm:inline">Lịch cố định</span>
                    </Button>
                    <Button className="gap-2" onClick={() => setShowNewBookingModal(true)}>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Đặt sân mới</span>
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-4 p-4 bg-background-secondary rounded-lg border border-border">
                {/* Venue selector */}
                <div className="flex items-center gap-4">
                    <label className="text-sm text-foreground-secondary">Cơ sở:</label>
                    <select
                        value={selectedVenueId}
                        onChange={(e) => setSelectedVenueId(e.target.value)}
                        className="bg-background-tertiary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {venuesData?.data.map((venue: Venue) => (
                            <option key={venue.id} value={venue.id}>
                                {venue.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date navigation */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={goToPreviousDay}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-background-tertiary rounded-lg">
                        <CalendarIcon className="w-4 h-4 text-foreground-secondary" />
                        <span className="font-medium">
                            {formatDate(selectedDate)}
                        </span>
                        {isToday && (
                            <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-500 rounded">
                                Hôm nay
                            </span>
                        )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={goToNextDay}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    {!isToday && (
                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Hôm nay
                        </Button>
                    )}
                </div>

                {/* View toggle */}
                <ViewToggle activeView={viewMode} onViewChange={setViewMode} />

                {/* Quick stats */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-foreground-secondary">
                        {calendarData?.bookings.length || 0} lịch đặt
                    </span>
                </div>
            </div>

            {/* Main content with sidebar */}
            <div className="flex flex-1 gap-4 min-h-0">
                {/* Sidebar - hidden on mobile */}
                <aside className="hidden lg:flex flex-col w-72 gap-4">
                    {/* Mini Calendar */}
                    <MiniCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />

                    {/* Quick Stats Card */}
                    <div className="bg-background-secondary rounded-xl border border-border p-4">
                        <h3 className="text-sm font-medium text-foreground-secondary mb-3">
                            Tổng quan hôm nay
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Tổng lịch đặt</span>
                                <span className="text-lg font-bold text-foreground">
                                    {calendarData?.bookings.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Đang chơi</span>
                                <span className="text-lg font-bold text-green-400">
                                    {calendarData?.bookings.filter(b => b.status === 'IN_PROGRESS').length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Sắp tới</span>
                                <span className="text-lg font-bold text-blue-400">
                                    {calendarData?.bookings.filter(b => b.status === 'CONFIRMED').length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Calendar Views */}
                <div className="flex-1 overflow-auto bg-background-secondary rounded-lg border border-border">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                    ) : calendarData?.courts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
                            <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
                            <p>Chưa có sân nào được thiết lập</p>
                        </div>
                    ) : (
                        <>
                            {/* Day View */}
                            {viewMode === 'day' && (
                                <div
                                    className="grid min-w-max"
                                    style={{
                                        gridTemplateColumns: `80px repeat(${calendarData?.courts.length || 1}, minmax(200px, 1fr))`,
                                        gridTemplateRows: `auto repeat(${TIME_SLOTS.length * 2}, 30px)`,
                                    }}
                                >
                                    {/* Header row */}
                                    <div className="sticky top-0 left-0 z-20 bg-background-tertiary border-b border-r border-border" />
                                    {calendarData?.courts.map((court) => (
                                        <div
                                            key={court.id}
                                            className="sticky top-0 z-10 bg-background-tertiary border-b border-r border-border px-4 py-3 text-center font-medium"
                                        >
                                            {court.name}
                                        </div>
                                    ))}

                                    {/* Time slots */}
                                    {TIME_SLOTS.map((time, idx) => (
                                        <React.Fragment key={`time-row-${time}`}>
                                            {/* Time label - spans 2 rows (1 hour = 2 x 30min slots) */}
                                            <div
                                                key={`time-${time}`}
                                                className="sticky left-0 z-10 bg-background-secondary border-r border-border px-3 py-1 text-xs text-foreground-secondary text-right"
                                                style={{ gridRow: `${idx * 2 + 2} / span 2` }}
                                            >
                                                {time}
                                            </div>

                                            {/* Empty cells for each court */}
                                            {calendarData?.courts.map((court) => (
                                                <div
                                                    key={`cell-${time}-${court.id}`}
                                                    className={cn(
                                                        'border-r border-b border-border/50 relative',
                                                        idx % 2 === 0 ? 'border-b-border' : ''
                                                    )}
                                                    style={{ gridColumn: calendarData.courts.indexOf(court) + 2 }}
                                                />
                                            ))}
                                        </React.Fragment>
                                    ))}

                                    {/* Bookings overlay */}
                                    {calendarData?.courts.map((court, courtIdx) =>
                                        bookingsByCourtId[court.id]?.map((slot) => (
                                            <div
                                                key={slot.booking.id}
                                                className={cn(
                                                    'absolute mx-1 my-0.5 p-2 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg group',
                                                    getStatusColor(slot.booking.status)
                                                )}
                                                style={{
                                                    gridColumn: courtIdx + 2,
                                                    gridRow: `${slot.gridRow} / span ${slot.gridRowSpan}`,
                                                    position: 'relative',
                                                }}
                                                onClick={() => setSelectedBooking(slot.booking)}
                                            >
                                                <div className="flex flex-col h-full overflow-hidden">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium">
                                                            {slot.booking.startTime} - {slot.booking.endTime}
                                                        </span>
                                                        {/* Quick Check-in Button - visible on hover for CONFIRMED bookings */}
                                                        {slot.booking.status === 'CONFIRMED' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    checkInMutation.mutate(slot.booking.id);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-600 text-white text-[10px] px-2 py-0.5 rounded transition-all font-medium"
                                                                title="Check-in nhanh"
                                                            >
                                                                ✓ Check-in
                                                            </button>
                                                        )}
                                                        {slot.booking.status !== 'CONFIRMED' && (
                                                            <span className="text-[10px] opacity-75">
                                                                {getStatusLabel(slot.booking.status)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {slot.booking.customer && (
                                                        <div className="mt-1 text-sm font-medium truncate">
                                                            {slot.booking.customer.name}
                                                        </div>
                                                    )}
                                                    <div className="mt-auto text-xs opacity-75">
                                                        {formatCurrency(slot.booking.totalAmount)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Week View */}
                            {viewMode === 'week' && (
                                <WeekView
                                    weekStartDate={selectedDate}
                                    courts={calendarData?.courts || []}
                                    bookings={calendarData?.bookings || []}
                                    onSlotClick={(_courtId, date, _time) => {
                                        setSelectedDate(date);
                                        setShowNewBookingModal(true);
                                    }}
                                    onBookingClick={setSelectedBooking}
                                />
                            )}

                            {/* List View */}
                            {viewMode === 'list' && (
                                <ListView
                                    bookings={calendarData?.bookings || []}
                                    onBookingClick={setSelectedBooking}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Booking Detail Panel (slide-in) */}
            <BookingDetailPanel
                booking={selectedBooking}
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                onCheckIn={(id) => checkInMutation.mutate(id)}
                onCheckOut={(id) => checkOutMutation.mutate(id)}
                onCancel={(id) => cancelMutation.mutate(id)}
                onEdit={(booking) => {
                    setEditingBooking(booking);
                    setShowEditBookingModal(true);
                    setSelectedBooking(null);
                }}
            />

            {/* Recurring Booking Modal */}
            <RecurringBookingModal
                isOpen={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
                courts={calendarData?.courts.map(c => ({ id: c.id, name: c.name })) || []}
                onSubmit={(data: RecurringBookingInput) => {
                    recurringBookingApi.create(data).then(() => {
                        toast({ title: 'Đã tạo lịch đặt định kỳ' });
                        setShowRecurringModal(false);
                        queryClient.invalidateQueries({ queryKey: ['calendar'] });
                    }).catch(() => {
                        toast({ title: 'Lỗi khi tạo lịch định kỳ', variant: 'error' });
                    });
                }}
            />

            {/* New Booking Modal */}
            <NewBookingModal
                isOpen={showNewBookingModal}
                onClose={() => setShowNewBookingModal(false)}
                courts={calendarData?.courts || []}
                selectedDate={selectedDate}
                onSuccess={() => {
                    toast({ title: 'Đã tạo lịch đặt sân!' });
                    setShowNewBookingModal(false);
                    queryClient.invalidateQueries({ queryKey: ['calendar'] });
                }}
            />

            {/* Edit Booking Modal */}
            <EditBookingModal
                isOpen={showEditBookingModal}
                onClose={() => {
                    setShowEditBookingModal(false);
                    setEditingBooking(null);
                }}
                booking={editingBooking}
                onSuccess={() => {
                    setShowEditBookingModal(false);
                    setEditingBooking(null);
                    queryClient.invalidateQueries({ queryKey: ['calendar'] });
                }}
            />
        </div>
    );
}
