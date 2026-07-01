import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Phone, Search, Star, Trophy, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { publicBookingApi, PublicBooking } from '@/services/public-booking.service';

type Filter = 'upcoming' | 'completed' | 'cancelled' | 'all';

export default function ClientBookingLookupPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [submittedPhone, setSubmittedPhone] = useState('');
    const [filter, setFilter] = useState<Filter>('upcoming');

    const lookupQuery = useQuery({
        queryKey: ['public', 'lookup', submittedPhone],
        queryFn: () => publicBookingApi.lookup(submittedPhone),
        enabled: submittedPhone.replace(/\D/g, '').length >= 9,
    });

    const bookings = lookupQuery.data?.bookings || [];
    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'completed') return booking.status === 'COMPLETED';
        if (filter === 'cancelled') return booking.status === 'CANCELLED';
        return ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(booking.status);
    });

    return (
        <div 
            className="min-h-screen bg-background text-foreground"
            style={{
                backgroundImage: 'url("/bg-client.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            <header className="border-b border-border bg-background-secondary">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <button onClick={() => navigate('/book')} className="flex items-center gap-2 text-xl font-bold text-primary-500">
                        <img src="/logo.png" alt="CourtHub Logo" className="h-8 w-auto object-contain" />
                        <span>CourtHub</span>
                    </button>
                    <Button variant="secondary" onClick={() => navigate('/book')}>Đặt sân</Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="rounded-2xl border border-border bg-background-secondary p-5 md:p-6">
                    <h1 className="text-2xl font-bold">Tra cứu lịch đặt</h1>
                    <p className="mt-2 text-foreground-secondary">Nhập số điện thoại đã dùng khi đặt sân để xem lịch và điểm tích lũy.</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0912 345 678"
                            icon={<Phone className="h-4 w-4" />}
                        />
                        <Button
                            className="gap-2"
                            onClick={() => setSubmittedPhone(phone)}
                            disabled={phone.replace(/\D/g, '').length < 9}
                        >
                            <Search className="h-4 w-4" />
                            Tra cứu
                        </Button>
                    </div>
                </div>

                {lookupQuery.isFetching && (
                    <div className="mt-8 flex justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                    </div>
                )}

                {lookupQuery.data && (
                    <>
                        {lookupQuery.data.customer ? (
                            <section className="mt-6 grid gap-4 md:grid-cols-4">
                                <SummaryCard icon={Star} label="Điểm tích lũy" value={lookupQuery.data.summary.points.toLocaleString()} />
                                <SummaryCard icon={Calendar} label="Lượt đặt" value={lookupQuery.data.summary.totalBookings.toLocaleString()} />
                                <SummaryCard icon={Wallet} label="Tổng chi tiêu" value={formatCurrency(lookupQuery.data.summary.totalSpent)} />
                                <SummaryCard icon={Trophy} label="Hạng" value={lookupQuery.data.customer.membershipTier || 'Thường'} />
                            </section>
                        ) : (
                            <div className="mt-6 rounded-xl border border-border bg-background-secondary p-8 text-center">
                                <p className="font-semibold">Chưa có lịch đặt nào</p>
                                <p className="mt-2 text-sm text-foreground-secondary">Số điện thoại này chưa có dữ liệu trên hệ thống.</p>
                                <Button className="mt-4" onClick={() => navigate('/book')}>Đặt sân ngay</Button>
                            </div>
                        )}

                        {lookupQuery.data.customer && (
                            <section className="mt-6 rounded-2xl border border-border bg-background-secondary">
                                <div className="flex flex-wrap gap-2 border-b border-border p-4">
                                    {[
                                        { id: 'upcoming', label: 'Sắp tới' },
                                        { id: 'completed', label: 'Đã chơi' },
                                        { id: 'cancelled', label: 'Đã hủy' },
                                        { id: 'all', label: 'Tất cả' },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setFilter(tab.id as Filter)}
                                            className={cn(
                                                'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                                filter === tab.id
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-background-tertiary text-foreground-secondary hover:text-foreground'
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid gap-3 p-4">
                                    {filteredBookings.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-border p-8 text-center text-foreground-secondary">
                                            Không có lịch phù hợp.
                                        </div>
                                    ) : filteredBookings.map(booking => (
                                        <BookingCard key={booking.id} booking={booking} onClick={() => navigate(`/booking/${booking.id}`)} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-border bg-background-secondary p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-foreground-secondary">
                <Icon className="h-4 w-4 text-primary-500" />
                {label}
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

function BookingCard({ booking, onClick }: { booking: PublicBooking; onClick: () => void }) {
    return (
        <button onClick={onClick} className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary-500/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="rounded bg-background-tertiary px-2 py-1 font-mono text-xs">{booking.bookingCode}</span>
                        <StatusBadge status={booking.status} />
                    </div>
                    <p className="font-semibold">{booking.court.name} · {booking.court.venue.name}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{formatDate(booking.date)} · {booking.startTime} - {booking.endTime}</p>
                    {booking.addons.length > 0 && (
                        <p className="mt-1 text-xs text-foreground-muted">{booking.addons.length} dịch vụ/sản phẩm đặt kèm</p>
                    )}
                </div>
                <div className="text-left md:text-right">
                    <p className="text-lg font-bold text-primary-500">{formatCurrency(booking.totalAmount)}</p>
                    <p className="text-xs text-foreground-secondary">{booking.estimatedPoints} điểm dự kiến</p>
                </div>
            </div>
        </button>
    );
}

function StatusBadge({ status }: { status: PublicBooking['status'] }) {
    const config = {
        PENDING: 'bg-warning/15 text-warning',
        CONFIRMED: 'bg-info/15 text-info',
        IN_PROGRESS: 'bg-primary-500/15 text-primary-500',
        COMPLETED: 'bg-foreground-muted/15 text-foreground-secondary',
        CANCELLED: 'bg-error/15 text-error',
        NO_SHOW: 'bg-error/15 text-error',
    }[status];

    const label = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        IN_PROGRESS: 'Đang chơi',
        COMPLETED: 'Đã chơi',
        CANCELLED: 'Đã hủy',
        NO_SHOW: 'Không đến',
    }[status];

    return <span className={cn('rounded px-2 py-1 text-xs font-medium', config)}>{label}</span>;
}
