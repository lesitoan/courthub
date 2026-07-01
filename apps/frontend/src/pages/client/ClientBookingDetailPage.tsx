import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarClock, Phone, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { publicBookingApi, PublicBooking, PublicCourt, PublicTimeSlot } from '@/services/public-booking.service';
import { useToast } from '@/hooks/use-toast';

function sortSlots(slots: PublicTimeSlot[]) {
    return [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function areSlotsContiguous(slots: PublicTimeSlot[]) {
    const sorted = sortSlots(slots);
    return sorted.every((slot, index) => index === 0 || sorted[index - 1].endTime === slot.startTime);
}

function getSlotRange(slots: PublicTimeSlot[]) {
    const sorted = sortSlots(slots);
    if (!sorted.length) return null;
    return {
        startTime: sorted[0].startTime,
        endTime: sorted[sorted.length - 1].endTime,
        price: sorted.reduce((sum, slot) => sum + slot.price, 0),
    };
}

export default function ClientBookingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [mode, setMode] = useState<'none' | 'reschedule' | 'cancel'>('none');
    const [phone, setPhone] = useState('');
    const [reason, setReason] = useState('');
    const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
    const [newCourtId, setNewCourtId] = useState('');
    const [newSlots, setNewSlots] = useState<PublicTimeSlot[]>([]);

    const bookingQuery = useQuery({
        queryKey: ['public', 'booking', id],
        queryFn: () => publicBookingApi.getBooking(id!),
        enabled: !!id,
    });

    const booking = bookingQuery.data;

    const courtsQuery = useQuery({
        queryKey: ['public', 'courts', booking?.court.venue.id],
        queryFn: () => publicBookingApi.getCourts(booking!.court.venue.id),
        enabled: !!booking?.court.venue.id && mode === 'reschedule',
    });

    const effectiveCourtId = newCourtId || booking?.courtId || '';
    const slotsQuery = useQuery({
        queryKey: ['public', 'availability', effectiveCourtId, newDate],
        queryFn: () => publicBookingApi.getAvailability(effectiveCourtId, newDate, id),
        enabled: !!effectiveCourtId && !!newDate && mode === 'reschedule',
    });

    const newRange = getSlotRange(newSlots);

    const rescheduleMutation = useMutation({
        mutationFn: () => publicBookingApi.reschedule(id!, {
            phone,
            courtId: effectiveCourtId,
            date: newDate,
            startTime: newRange!.startTime,
            endTime: newRange!.endTime,
            reason,
        }),
        onSuccess: () => {
            toast({ title: 'Đã đổi lịch thành công', variant: 'success' });
            setMode('none');
            queryClient.invalidateQueries({ queryKey: ['public', 'booking', id] });
        },
        onError: (error: any) => {
            toast({ title: 'Không thể đổi lịch', description: error.response?.data?.message, variant: 'error' });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: () => publicBookingApi.cancel(id!, { phone, reason }),
        onSuccess: () => {
            toast({ title: 'Đã hủy lịch', variant: 'success' });
            setMode('none');
            queryClient.invalidateQueries({ queryKey: ['public', 'booking', id] });
        },
        onError: (error: any) => {
            toast({ title: 'Không thể hủy lịch', description: error.response?.data?.message, variant: 'error' });
        },
    });

    const toggleNewSlot = (slot: PublicTimeSlot) => {
        if (!slot.available) return;

        const exists = newSlots.some(item => item.startTime === slot.startTime);
        const nextSlots = exists
            ? newSlots.filter(item => item.startTime !== slot.startTime)
            : sortSlots([...newSlots, slot]);

        if (nextSlots.length > 1 && !areSlotsContiguous(nextSlots)) {
            toast({
                title: 'Chỉ chọn khung giờ liền nhau',
                description: 'Khi đổi lịch, bạn chỉ có thể chọn nhiều giờ liên tiếp.',
                variant: 'error',
            });
            return;
        }

        setNewSlots(nextSlots);
    };

    if (bookingQuery.isLoading || !booking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    const actionDisabled = !booking.canChange;

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
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground-secondary hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </button>
                    <Button variant="secondary" onClick={() => navigate('/book')}>Đặt sân mới</Button>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
                <section className="rounded-2xl border border-border bg-background-secondary p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <StatusBadge status={booking.status} />
                            <h1 className="mt-3 text-2xl font-bold">{booking.bookingCode}</h1>
                            <p className="text-foreground-secondary">Chi tiết lịch đặt sân</p>
                        </div>
                        <Button variant="ghost" className="gap-2" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                            <Share2 className="h-4 w-4" />
                            Chia sẻ
                        </Button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <InfoCard label="Cơ sở" value={booking.court.venue.name} sub={booking.court.venue.address} />
                        <InfoCard label="Sân" value={booking.court.name} sub={booking.court.surfaceType || 'Tiêu chuẩn'} />
                        <InfoCard label="Thời gian" value={`${formatDate(booking.date)} · ${booking.startTime} - ${booking.endTime}`} sub="Có thể đổi/hủy trước 2 giờ" />
                        <InfoCard label="Khách hàng" value={booking.customer?.name || '-'} sub={booking.customer?.phone || ''} />
                    </div>

                    <div className="mt-6 rounded-xl bg-background-tertiary p-4">
                        <h2 className="font-semibold">Dịch vụ & sản phẩm</h2>
                        {booking.addons.length === 0 ? (
                            <p className="mt-2 text-sm text-foreground-secondary">Không có dịch vụ/sản phẩm đặt kèm.</p>
                        ) : (
                            <div className="mt-3 space-y-2 text-sm">
                                {booking.addons.map(addon => (
                                    <div key={`${addon.type}:${addon.id}`} className="flex justify-between gap-3">
                                        <span className="text-foreground-secondary">{addon.name} x{addon.quantity}</span>
                                        <span>{formatCurrency(addon.total)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                        <span className="font-semibold">Tổng tiền tạm tính</span>
                        <span className="text-2xl font-bold text-primary-500">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                </section>

                <aside className="space-y-4">
                    <ActionCard
                        icon={CalendarClock}
                        title="Đổi lịch"
                        description={actionDisabled ? 'Lịch này không còn trong thời gian cho phép đổi.' : 'Chọn ngày, sân và khung giờ mới còn trống.'}
                        button="Đổi lịch"
                        disabled={actionDisabled}
                        onClick={() => {
                            setMode('reschedule');
                            setPhone(booking.customer?.phone || '');
                            setNewDate(booking.date);
                            setNewCourtId(booking.courtId);
                            setNewSlots([]);
                        }}
                    />
                    <ActionCard
                        icon={Trash2}
                        title="Hủy lịch"
                        description={actionDisabled ? 'Lịch này không còn trong thời gian cho phép hủy.' : 'Hủy lịch trước giờ chơi tối thiểu 2 giờ.'}
                        button="Hủy lịch"
                        danger
                        disabled={actionDisabled}
                        onClick={() => {
                            setMode('cancel');
                            setPhone(booking.customer?.phone || '');
                        }}
                    />
                    <ActionCard
                        icon={Phone}
                        title="Gọi sân"
                        description={booking.court.venue.phone || 'Liên hệ sân để được hỗ trợ trực tiếp.'}
                        button="Gọi sân"
                        onClick={() => booking.court.venue.phone && (window.location.href = `tel:${booking.court.venue.phone}`)}
                    />
                </aside>
            </main>

            {mode === 'reschedule' && (
                <Modal title="Đổi lịch" onClose={() => setMode('none')}>
                    <div className="space-y-4">
                        <Input label="Số điện thoại xác nhận" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <Input label="Ngày mới" type="date" value={newDate} onChange={(e) => {
                            setNewDate(e.target.value);
                            setNewSlots([]);
                        }} />
                        <div>
                            <label className="mb-1 block text-sm text-foreground-secondary">Sân</label>
                            <select value={effectiveCourtId} onChange={(e) => {
                                setNewCourtId(e.target.value);
                                setNewSlots([]);
                            }} className="w-full rounded-lg border border-border bg-background-tertiary px-3 py-2 text-foreground">
                                {(courtsQuery.data || []).map((court: PublicCourt) => (
                                    <option key={court.id} value={court.id}>{court.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid max-h-64 gap-2 overflow-auto sm:grid-cols-2">
                            {(slotsQuery.data || []).map(slot => (
                                <button
                                    key={slot.startTime}
                                    disabled={!slot.available}
                                    onClick={() => toggleNewSlot(slot)}
                                    className={cn(
                                        'rounded-lg border p-3 text-left text-sm',
                                        newSlots.some(item => item.startTime === slot.startTime) ? 'border-primary-500 bg-primary-500/10' : 'border-border bg-background',
                                        !slot.available && 'opacity-40'
                                    )}
                                >
                                    <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
                                    <p className="text-primary-500">{formatCurrency(slot.price)}</p>
                                </button>
                            ))}
                        </div>
                        <Input label="Lý do đổi lịch (không bắt buộc)" value={reason} onChange={(e) => setReason(e.target.value)} />
                        {newRange && (
                            <div className="rounded-lg border border-primary-500/30 bg-primary-500/10 p-3 text-sm text-primary-500">
                                Đổi sang {newRange.startTime} - {newRange.endTime} · {formatCurrency(newRange.price)}
                            </div>
                        )}
                        <Button className="w-full" disabled={!phone || !newRange} isLoading={rescheduleMutation.isPending} onClick={() => rescheduleMutation.mutate()}>
                            Xác nhận đổi lịch
                        </Button>
                    </div>
                </Modal>
            )}

            {mode === 'cancel' && (
                <Modal title="Hủy lịch" onClose={() => setMode('none')}>
                    <div className="space-y-4">
                        <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-sm text-error">
                            Thao tác này sẽ hủy lịch đặt của bạn. Chỉ có thể hủy trước giờ chơi tối thiểu 2 giờ.
                        </div>
                        <Input label="Số điện thoại xác nhận" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <Input label="Lý do hủy (không bắt buộc)" value={reason} onChange={(e) => setReason(e.target.value)} />
                        <Button variant="destructive" className="w-full" disabled={!phone} isLoading={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
                            Xác nhận hủy lịch
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-foreground-secondary">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
            {sub && <p className="mt-1 text-sm text-foreground-muted">{sub}</p>}
        </div>
    );
}

function ActionCard({
    icon: Icon,
    title,
    description,
    button,
    danger,
    disabled,
    onClick,
}: {
    icon: typeof CalendarClock;
    title: string;
    description: string;
    button: string;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <div className="rounded-xl border border-border bg-background-secondary p-4">
            <div className="flex gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', danger ? 'bg-error/15 text-error' : 'bg-primary-500/15 text-primary-500')}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{description}</p>
                </div>
            </div>
            <Button variant={danger ? 'destructive' : 'primary'} className="mt-4 w-full" disabled={disabled} onClick={onClick}>
                {button}
            </Button>
        </div>
    );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-background-secondary p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="rounded-lg px-3 py-1 text-foreground-secondary hover:bg-background-hover">Đóng</button>
                </div>
                {children}
            </div>
        </div>
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
