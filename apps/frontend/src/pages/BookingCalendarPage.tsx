import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Repeat
} from 'lucide-react';
import { cn, formatCurrency, formatDate, formatDateInput } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { bookingApi, Booking } from '@/services/booking.service';
import { venueApi, Venue } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { ViewToggle, CalendarViewMode, MiniCalendar, WeekView, ListView } from '@/components/calendar';
import { RecurringBookingModal, BookingDetailPanel, NewBookingModal, EditBookingModal } from '@/components/booking';
import { recurringBookingApi, RecurringBookingInput } from '@/services/recurring-booking.service';
import { isOnlineBooking } from '@/lib/booking-meta';

// Time slots from 6:00 to 22:00; each empty cell represents a 1-hour range.
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
});
const SLOT_HEIGHT = 76;

function addOneHour(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    return `${String(hour + 1).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function timeToMinutes(time: string) {
    const [hour, minute] = time.slice(0, 5).split(':').map(Number);
    return hour * 60 + minute;
}

function getBookingCardHeight(booking: Booking) {
    const durationMinutes = Math.max(60, timeToMinutes(booking.endTime) - timeToMinutes(booking.startTime));
    return (durationMinutes / 60) * SLOT_HEIGHT - 12;
}

function getBookingStartAt(booking: Booking) {
    const result = new Date(booking.date);
    const [hours, minutes] = booking.startTime.slice(0, 5).split(':').map(Number);
    result.setHours(hours, minutes || 0, 0, 0);
    return result;
}

function getCheckInWindowStart(booking: Booking) {
    const result = getBookingStartAt(booking);
    result.setMinutes(result.getMinutes() - 15);
    return result;
}

function canCheckInNow(booking: Booking) {
    return new Date().getTime() >= getCheckInWindowStart(booking).getTime();
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

function isStaffBookableSlot(date: Date, time: string) {
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDay.getTime() < today.getTime()) return false;
    if (selectedDay.getTime() > today.getTime()) return true;

    const now = new Date();
    const minHour = now.getMinutes() < 30 ? now.getHours() : now.getHours() + 1;
    const minTime = `${String(minHour).padStart(2, '0')}:00`;
    return time >= minTime;
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
    const [activeSlot, setActiveSlot] = useState<{ courtId: string; time: string; endTime: string } | null>(null);
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
        queryKey: ['calendar', selectedVenueId, formatDateInput(selectedDate)],
        queryFn: () => bookingApi.getCalendarData(
            selectedVenueId,
            formatDateInput(selectedDate),
            formatDateInput(selectedDate)
        ),
        enabled: !!selectedVenueId,
    });

    // Check-in mutation
    const confirmMutation = useMutation({
        mutationFn: (id: string) => bookingApi.update(id, { status: 'CONFIRMED' }),
        onSuccess: () => {
            toast({ title: 'Đã xác nhận lịch đặt!' });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setSelectedBooking(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi xác nhận lịch đặt', variant: 'error' });
        },
    });

    const checkInMutation = useMutation({
        mutationFn: (id: string) => bookingApi.checkIn(id),
        onSuccess: () => {
            toast({ title: 'Check-in thanh cong!' });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
            setSelectedBooking(null);
        },
        onError: (error: any) => {
            toast({
                title: 'Khong the check-in',
                description: error.response?.data?.message || 'Chi co the check-in truoc gio choi toi da 15 phut',
                variant: 'error',
            });
        },
    });

    const handleCheckIn = (booking: Booking) => {
        if (!canCheckInNow(booking)) {
            toast({
                title: 'Chua den gio check-in',
                description: `Chi co the check-in tu ${getCheckInWindowStart(booking).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} tro di.`,
                variant: 'error',
            });
            return;
        }

        checkInMutation.mutate(booking.id);
    };

    const handleCheckInById = (id: string) => {
        const booking = selectedBooking?.id === id
            ? selectedBooking
            : calendarData?.bookings.find(item => item.id === id);

        if (booking) {
            handleCheckIn(booking);
            return;
        }

        checkInMutation.mutate(id);
    };

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

    const openNewBookingModal = (courtId?: string, time?: string, date?: Date) => {
        const targetDate = date || selectedDate;
        if (courtId && time && !isStaffBookableSlot(targetDate, time)) {
            toast({
                title: 'Không thể đặt khung giờ đã qua',
                description: 'Vui lòng chọn khung giờ hợp lệ theo thời điểm hiện tại.',
                variant: 'error',
            });
            return;
        }

        if (date) setSelectedDate(date);
        setActiveSlot(courtId && time ? { courtId, time, endTime: addOneHour(time) } : null);
        setShowNewBookingModal(true);
    };

    const isActiveSlot = (courtId: string, time: string) =>
        activeSlot?.courtId === courtId && activeSlot.time === time;

    const bookingsByCourtAndStart = useMemo(() => {
        if (!calendarData?.bookings) return {};

        const map: Record<string, Record<string, Booking>> = {};
        calendarData.bookings.forEach((booking) => {
            const startTime = booking.startTime.slice(0, 5);
            if (!map[booking.courtId]) map[booking.courtId] = {};
            map[booking.courtId][startTime] = booking;
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
                    <Button className="gap-2" onClick={() => openNewBookingModal()}>
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
                                <div className="min-w-[900px]">
                                    <div
                                        className="sticky top-0 z-20 grid bg-background-tertiary border-b border-border"
                                        style={{
                                            gridTemplateColumns: `80px repeat(${calendarData?.courts.length || 1}, minmax(180px, 1fr))`,
                                        }}
                                    >
                                        <div className="border-r border-border" />
                                        {calendarData?.courts.map((court) => (
                                            <div
                                                key={court.id}
                                                className="border-r border-border px-4 py-3 text-center font-medium"
                                            >
                                                {court.name}
                                            </div>
                                        ))}
                                    </div>

                                    {TIME_SLOTS.map((time) => (
                                        <div
                                            key={time}
                                            className="grid border-b border-border/60"
                                            style={{
                                                gridTemplateColumns: `80px repeat(${calendarData?.courts.length || 1}, minmax(180px, 1fr))`,
                                                height: SLOT_HEIGHT,
                                            }}
                                        >
                                            <div className="sticky left-0 z-10 bg-background-secondary border-r border-border px-3 py-4 text-xs text-foreground-secondary text-right">
                                                {time}
                                            </div>
                                            {calendarData?.courts.map((court) => {
                                                const booking = bookingsByCourtAndStart[court.id]?.[time];
                                                const active = isActiveSlot(court.id, time);
                                                const isPastSlot = !isStaffBookableSlot(selectedDate, time);

                                                return (
                                                    <div
                                                        key={`${time}-${court.id}`}
                                                        className={cn(
                                                            'relative h-[76px] overflow-visible border-r border-border/60 p-1.5 transition-colors',
                                                            active && 'bg-primary-500/10'
                                                        )}
                                                    >
                                                        {booking ? (
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    'group absolute inset-x-1.5 top-1.5 z-20 flex min-h-[64px] flex-col rounded-lg border p-2 text-left transition-all hover:scale-[1.01] hover:shadow-lg',
                                                                    getStatusColor(booking.status),
                                                                    active && 'ring-2 ring-primary-500 ring-offset-2 ring-offset-background-secondary'
                                                                )}
                                                                style={{ height: getBookingCardHeight(booking) }}
                                                                onClick={() => {
                                                                    setActiveSlot({ courtId: court.id, time, endTime: booking.endTime.slice(0, 5) });
                                                                    setSelectedBooking(booking);
                                                                }}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <span className="text-xs font-medium">
                                                                        {booking.startTime} - {booking.endTime}
                                                                    </span>
                                                                    {isOnlineBooking(booking.notes) ? (
                                                                        <span className="rounded bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-500">
                                                                            Trực tuyến
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] opacity-75">
                                                                            {getStatusLabel(booking.status)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {booking.customer && (
                                                                    <div className="mt-1 truncate text-sm font-medium">
                                                                        {booking.customer.name}
                                                                    </div>
                                                                )}
                                                                <div className="mt-auto flex items-center justify-between gap-2 text-xs opacity-80">
                                                                    <span>{formatCurrency(booking.totalAmount)}</span>
                                                                    {booking.status === 'CONFIRMED' && (
                                                                        <span
                                                                            role="button"
                                                                            tabIndex={0}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleCheckIn(booking);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                                    e.stopPropagation();
                                                                                    handleCheckIn(booking);
                                                                                }
                                                                            }}
                                                                            className="opacity-0 rounded bg-green-500 px-2 py-0.5 text-[10px] font-medium text-white transition-opacity group-hover:opacity-100"
                                                                        >
                                                                            Check-in
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    'h-full min-h-[64px] w-full rounded-lg border border-dashed text-xs transition-colors',
                                                                    active
                                                                        ? 'border-primary-500 bg-primary-500/15 text-primary-500 shadow-glow'
                                                                        : isPastSlot
                                                                            ? 'border-transparent text-foreground-muted/60 opacity-50 cursor-not-allowed hover:border-red-500/40 hover:bg-red-500/10'
                                                                            : 'border-transparent text-foreground-muted hover:border-border hover:bg-background-tertiary'
                                                                )}
                                                                aria-disabled={isPastSlot}
                                                                onClick={() => openNewBookingModal(court.id, time)}
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Week View */}
                            {viewMode === 'week' && (
                                <WeekView
                                    weekStartDate={selectedDate}
                                    courts={calendarData?.courts || []}
                                    bookings={calendarData?.bookings || []}
                                    onSlotClick={(courtId, date, time) => openNewBookingModal(courtId, time, date)}
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
                onConfirm={(id) => confirmMutation.mutate(id)}
                onCheckIn={handleCheckInById}
                onCheckOut={(id) => checkOutMutation.mutate(id)}
                onCancel={(id) => cancelMutation.mutate(id)}
                isLoading={confirmMutation.isPending || checkInMutation.isPending || checkOutMutation.isPending || cancelMutation.isPending}
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
                selectedCourtId={activeSlot?.courtId}
                selectedTime={activeSlot?.time}
                selectedEndTime={activeSlot?.endTime}
                existingBookings={calendarData?.bookings || []}
                onSuccess={() => {
                    toast({ title: 'Đã tạo lịch đặt sân!' });
                    setShowNewBookingModal(false);
                    setActiveSlot(null);
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
