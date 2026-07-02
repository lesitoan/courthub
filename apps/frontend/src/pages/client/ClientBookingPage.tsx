import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    CalendarDays,
    Check,
    Clock,
    MapPin,
    Minus,
    Phone,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';
import {
    publicBookingApi,
    PublicCourt,
    PublicProduct,
    PublicService,
    PublicTimeSlot,
} from '@/services/public-booking.service';
import { useToast } from '@/hooks/use-toast';

type AddonKey = `product:${string}` | `service:${string}`;

const steps = ['Cơ sở', 'Ngày', 'Sân', 'Giờ', 'Dịch vụ', 'Thông tin'];

function todayString(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
}

function formatHumanDate(date: string) {
    return new Intl.DateTimeFormat('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
}

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

function CourtVisual({ selected }: { selected?: boolean }) {
    return (
        <div className={cn(
            'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border',
            selected ? 'border-primary-500' : 'border-border'
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-300 via-primary-500 to-primary-800" />
            <div className="absolute inset-2 border border-white/70" />
            <div className="absolute left-1/2 top-2 bottom-2 w-px bg-white/80" />
            <div className="absolute left-2 right-2 top-1/2 h-px bg-white/80" />
            <div className="absolute inset-0 bg-black/10" />
        </div>
    );
}

function PublicHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="CourtHub Logo" className="h-10 w-auto object-contain" />
                    <div>
                        <p className="text-xl font-bold text-primary-500">CourtHub</p>
                        <p className="hidden text-xs text-foreground-secondary sm:block">Đặt sân nhanh chóng, không cần tài khoản</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => window.location.href = '/booking-lookup'}>
                        Tra cứu lịch
                    </Button>
                    <Button variant="ghost" size="icon" title="Gọi sân">
                        <Phone className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

function StepRail({ activeIndex }: { activeIndex: number }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto py-2">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                    <div className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                        index <= activeIndex
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-border bg-background-secondary text-foreground-muted'
                    )}>
                        {index < activeIndex ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </div>
                    <span className={cn(
                        'hidden text-xs font-medium sm:inline',
                        index <= activeIndex ? 'text-primary-500' : 'text-foreground-muted'
                    )}>
                        {step}
                    </span>
                    {index < steps.length - 1 && <div className="h-px w-6 bg-border" />}
                </div>
            ))}
        </div>
    );
}

export default function ClientBookingPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedVenueId, setSelectedVenueId] = useState('');
    const [selectedDate, setSelectedDate] = useState(todayString(1));
    const [selectedCourt, setSelectedCourt] = useState<PublicCourt | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<PublicTimeSlot[]>([]);
    const [addonQuantities, setAddonQuantities] = useState<Record<AddonKey, number>>({} as Record<AddonKey, number>);
    const [addonSearch, setAddonSearch] = useState('');
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '', notes: '' });

    const venuesQuery = useQuery({
        queryKey: ['public', 'venues'],
        queryFn: publicBookingApi.getVenues,
    });

    const venues = venuesQuery.data || [];
    const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];
    const venueId = selectedVenue?.id || '';

    useMemo(() => {
        if (!selectedVenueId && venues[0]?.id) {
            setSelectedVenueId(venues[0].id);
        }
    }, [selectedVenueId, venues]);

    const courtsQuery = useQuery({
        queryKey: ['public', 'courts', venueId],
        queryFn: () => publicBookingApi.getCourts(venueId),
        enabled: !!venueId,
    });

    const addonsQuery = useQuery({
        queryKey: ['public', 'addons', venueId],
        queryFn: () => publicBookingApi.getAddons(venueId),
        enabled: !!venueId,
    });

    const courtId = selectedCourt?.id || '';
    const slotsQuery = useQuery({
        queryKey: ['public', 'availability', courtId, selectedDate],
        queryFn: () => publicBookingApi.getAvailability(courtId, selectedDate),
        enabled: !!courtId && !!selectedDate,
    });

    const courts = courtsQuery.data || [];
    const products = addonsQuery.data?.products || [];
    const services = addonsQuery.data?.services || [];
    const slots = slotsQuery.data || [];

    const selectedAddons = useMemo(() => {
        const rows: Array<{
            type: 'product' | 'service';
            id: string;
            name: string;
            price: number;
            unit: string;
            quantity: number;
            total: number;
        }> = [];

        products.forEach(product => {
            const quantity = addonQuantities[`product:${product.id}`] || 0;
            if (quantity > 0) {
                rows.push({
                    type: 'product',
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    unit: product.unit,
                    quantity,
                    total: quantity * product.price,
                });
            }
        });

        services.forEach(service => {
            const quantity = addonQuantities[`service:${service.id}`] || 0;
            if (quantity > 0) {
                rows.push({
                    type: 'service',
                    id: service.id,
                    name: service.name,
                    price: service.price,
                    unit: service.unit,
                    quantity,
                    total: quantity * service.price,
                });
            }
        });

        return rows;
    }, [addonQuantities, products, services]);

    const addonTotal = selectedAddons.reduce((sum, item) => sum + item.total, 0);
    const selectedRange = getSlotRange(selectedSlots);
    const courtTotal = selectedRange?.price || 0;
    const total = courtTotal + addonTotal;
    const estimatedPoints = Math.floor(total / 10000);

    const activeStep = !venueId ? 0 : !selectedDate ? 1 : !selectedCourt ? 2 : !selectedSlots.length ? 3 : selectedAddons.length ? 4 : 5;

    const createMutation = useMutation({
        mutationFn: () => publicBookingApi.createBooking({
            venueId,
            courtId: selectedCourt!.id,
            date: selectedDate,
            startTime: selectedRange!.startTime,
            endTime: selectedRange!.endTime,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email || undefined,
            notes: customer.notes || undefined,
            addons: selectedAddons.map(item => ({ type: item.type, id: item.id, quantity: item.quantity })),
        }),
        onSuccess: ({ booking }) => {
            navigate(`/book/success/${booking.id}`);
        },
        onError: (error: any) => {
            toast({
                title: 'Không thể đặt sân',
                description: error.response?.data?.message || 'Vui lòng kiểm tra thông tin và thử lại',
                variant: 'error',
            });
        },
    });

    const canSubmit = !!venueId && !!selectedCourt && !!selectedRange && customer.name.trim() && customer.phone.replace(/\D/g, '').length >= 9;

    const updateAddon = (type: 'product' | 'service', id: string, delta: number, max = 99) => {
        const key = `${type}:${id}` as AddonKey;
        setAddonQuantities(prev => {
            const next = Math.max(0, Math.min(max, (prev[key] || 0) + delta));
            return { ...prev, [key]: next };
        });
    };

    const toggleSlot = (slot: PublicTimeSlot) => {
        if (!slot.available) return;

        const exists = selectedSlots.some(item => item.startTime === slot.startTime);
        const nextSlots = exists
            ? selectedSlots.filter(item => item.startTime !== slot.startTime)
            : sortSlots([...selectedSlots, slot]);

        if (nextSlots.length > 1 && !areSlotsContiguous(nextSlots)) {
            toast({
                title: 'Chỉ chọn khung giờ liền nhau',
                description: 'Bạn có thể chọn nhiều giờ liên tiếp, không chọn các giờ cách quãng.',
                variant: 'error',
            });
            return;
        }

        setSelectedSlots(nextSlots);
    };

    const renderAddonCard = (item: PublicProduct | PublicService, type: 'product' | 'service') => {
        const key = `${type}:${item.id}` as AddonKey;
        const quantity = addonQuantities[key] || 0;
        const product = type === 'product' ? item as PublicProduct : null;
        const max = product ? product.stock : 20;
        const disabled = product ? product.stock <= 0 : false;

        return (
            <div
                key={key}
                className={cn(
                    'rounded-lg border bg-background-secondary p-4 transition-colors',
                    quantity > 0 ? 'border-primary-500 bg-primary-500/5' : 'border-border hover:border-primary-500/50',
                    disabled && 'opacity-50'
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-foreground-secondary">{item.description || 'Không có mô tả'}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="font-bold text-primary-500">{formatCurrency(item.price)}/{item.unit}</span>
                            {product && (
                                <span className={cn(
                                    'rounded px-2 py-0.5 text-xs',
                                    product.stock <= 10 ? 'bg-warning/15 text-warning' : 'bg-primary-500/15 text-primary-500'
                                )}>
                                    Kho: {product.stock}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-background-tertiary p-1">
                        <button
                            type="button"
                            onClick={() => updateAddon(type, item.id, -1, max)}
                            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-background-hover"
                            disabled={quantity === 0}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => updateAddon(type, item.id, 1, max)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:bg-background-hover disabled:text-foreground-muted"
                            disabled={disabled || quantity >= max}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const filteredServices = services.filter(item => item.name.toLowerCase().includes(addonSearch.toLowerCase()));
    const filteredProducts = products.filter(item => item.name.toLowerCase().includes(addonSearch.toLowerCase()));

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
            <PublicHeader />
            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                    <div>
                        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium text-primary-500">
                            <Sparkles className="h-4 w-4" />
                            Không cần tài khoản, tích điểm bằng số điện thoại
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Đặt sân cầu lông nhanh chóng</h1>
                        <p className="mt-3 max-w-2xl text-foreground-secondary">
                            Chọn sân, giờ chơi và dịch vụ đi kèm trong một luồng duy nhất. Bạn có thể tra cứu, đổi hoặc hủy lịch trước giờ chơi tối thiểu 2 giờ.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-border bg-background-secondary">
                        <div className="relative h-56">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.35),transparent_32%),linear-gradient(135deg,#0f3b25,#0a0a0a_55%,#171717)]" />
                            <div className="absolute inset-x-8 bottom-7 top-8 rounded-xl border-2 border-white/50 bg-primary-500/20 shadow-glow">
                                <div className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
                                <div className="absolute inset-x-0 top-1/2 h-px bg-white/70" />
                                <div className="absolute inset-6 border border-white/40" />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="space-y-6 min-w-0">
                        <div className="rounded-xl border border-border bg-background-secondary p-4 min-w-0 overflow-hidden">
                            <StepRail activeIndex={activeStep} />
                        </div>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">1. Chọn cơ sở</h2>
                                    <p className="text-sm text-foreground-secondary">Chọn địa điểm bạn muốn chơi.</p>
                                </div>
                                <MapPin className="h-5 w-5 text-primary-500" />
                            </div>
                            <select
                                value={venueId}
                                onChange={(event) => {
                                    setSelectedVenueId(event.target.value);
                                    setSelectedCourt(null);
                                    setSelectedSlots([]);
                                    setAddonQuantities({} as Record<AddonKey, number>);
                                }}
                                className="w-full rounded-lg border border-border bg-background-tertiary px-3 py-3 text-foreground outline-none focus:border-primary-500"
                            >
                                {venues.map(venue => (
                                    <option key={venue.id} value={venue.id}>{venue.name}</option>
                                ))}
                            </select>
                            {selectedVenue && (
                                <div className="mt-4 grid gap-3 rounded-lg bg-background-tertiary p-4 text-sm text-foreground-secondary sm:grid-cols-3">
                                    <span>{selectedVenue.address}</span>
                                    <span>{selectedVenue.openTime} - {selectedVenue.closeTime}</span>
                                    <span>{selectedVenue.phone || 'Chưa có hotline'}</span>
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">2. Chọn ngày</h2>
                                    <p className="text-sm text-foreground-secondary">Ngày chơi có thể đổi trước giờ bắt đầu 2 giờ.</p>
                                </div>
                                <CalendarDays className="h-5 w-5 text-primary-500" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
                                <Input type="date" value={selectedDate} min={todayString()} onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedSlots([]);
                                }} />
                                <Button variant="secondary" onClick={() => setSelectedDate(todayString())}>Hôm nay</Button>
                                <Button variant="secondary" onClick={() => setSelectedDate(todayString(1))}>Ngày mai</Button>
                                <Button variant="secondary" onClick={() => setSelectedDate(todayString(6))}>Cuối tuần</Button>
                            </div>
                        </section>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">3. Chọn sân</h2>
                                    <p className="text-sm text-foreground-secondary">{selectedVenue?.name || 'Chọn cơ sở trước'}</p>
                                </div>
                                <ShieldCheck className="h-5 w-5 text-primary-500" />
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                {courts.map(court => (
                                    <button
                                        key={court.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCourt(court);
                                            setSelectedSlots([]);
                                        }}
                                        className={cn(
                                            'flex items-center gap-4 rounded-xl border p-3 text-left transition-colors',
                                            selectedCourt?.id === court.id
                                                ? 'border-primary-500 bg-primary-500/5'
                                                : 'border-border bg-background hover:border-primary-500/50'
                                        )}
                                    >
                                        <CourtVisual selected={selectedCourt?.id === court.id} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-foreground">{court.name}</p>
                                                {selectedCourt?.id === court.id && (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-foreground-secondary">
                                                {court.isIndoor ? 'Trong nhà' : 'Ngoài trời'} · {court.surfaceType || 'Tiêu chuẩn'}
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-primary-500">Từ 150.000đ/giờ</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">4. Chọn khung giờ</h2>
                                    <p className="text-sm text-foreground-secondary">{selectedCourt ? `${selectedCourt.name} · ${formatHumanDate(selectedDate)}` : 'Chọn sân trước'}</p>
                                </div>
                                <Clock className="h-5 w-5 text-primary-500" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {selectedCourt ? slots.map(slot => (
                                    <button
                                        key={`${slot.startTime}-${slot.endTime}`}
                                        type="button"
                                        disabled={!slot.available}
                                        onClick={() => toggleSlot(slot)}
                                        className={cn(
                                            'flex items-center justify-between rounded-lg border p-3 text-left transition-colors',
                                            selectedSlots.some(item => item.startTime === slot.startTime)
                                                ? 'border-primary-500 bg-primary-500/10'
                                                : 'border-border bg-background hover:border-primary-500/50',
                                            !slot.available && 'cursor-not-allowed opacity-50 hover:border-border'
                                        )}
                                    >
                                        <div>
                                            <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
                                            <p className={cn('text-xs', slot.available ? 'text-primary-500' : 'text-foreground-muted')}>
                                                {slot.available ? 'Còn trống' : slot.isPast ? 'Đã qua' : 'Đã đặt'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatCurrency(slot.price)}</p>
                                            {selectedSlots.some(item => item.startTime === slot.startTime) && <Check className="ml-auto mt-1 h-4 w-4 text-primary-500" />}
                                        </div>
                                    </button>
                                )) : (
                                    <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-foreground-secondary">
                                        Chọn sân để xem giờ còn trống.
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">5. Dịch vụ & sản phẩm</h2>
                                    <p className="text-sm text-foreground-secondary">Đặt trước vợt, giày, nước uống hoặc huấn luyện viên.</p>
                                </div>
                                <div className="relative md:w-72">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                                    <input
                                        value={addonSearch}
                                        onChange={(e) => setAddonSearch(e.target.value)}
                                        placeholder="Tìm dịch vụ..."
                                        className="w-full rounded-lg border border-border bg-background-tertiary py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 xl:grid-cols-2">
                                <div>
                                    <h3 className="mb-3 font-medium text-primary-500">Thuê dịch vụ</h3>
                                    <div className="space-y-3">
                                        {filteredServices.map(item => renderAddonCard(item, 'service'))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-3 font-medium text-primary-500">Mua sản phẩm</h3>
                                    <div className="space-y-3">
                                        {filteredProducts.map(item => renderAddonCard(item, 'product'))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-border bg-background-secondary p-5">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">6. Thông tin khách hàng</h2>
                                <p className="text-sm text-foreground-secondary">Số điện thoại dùng để tra cứu lịch và tích điểm.</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Input label="Họ và tên" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                                <Input label="Số điện thoại" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                                <Input label="Email (không bắt buộc)" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-foreground-secondary">Ghi chú</label>
                                    <textarea
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                        placeholder="VD: Yêu cầu sân gần cửa ra vào..."
                                        className="min-h-28 w-full rounded-lg border border-border bg-background-tertiary px-3 py-2 text-foreground outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 rounded-lg bg-primary-500/10 p-4 text-sm text-primary-300">
                                <p className="flex gap-2"><Check className="h-4 w-4 shrink-0" /> Đổi hoặc hủy lịch trước giờ chơi ít nhất 2 giờ.</p>
                                <p className="mt-2 flex gap-2"><Check className="h-4 w-4 shrink-0" /> Điểm sẽ được cộng sau khi lịch hoàn tất hoặc thanh toán.</p>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-xl border border-border bg-background-secondary p-5 shadow-xl">
                            <h2 className="text-lg font-semibold">Tóm tắt đặt sân</h2>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-foreground-secondary">Cơ sở</span>
                                    <span className="text-right font-medium">{selectedVenue?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-foreground-secondary">Ngày</span>
                                    <span className="text-right font-medium">{formatHumanDate(selectedDate)}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-foreground-secondary">Sân</span>
                                    <span className="text-right font-medium">{selectedCourt?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-foreground-secondary">Giờ</span>
                                    <span className="text-right font-medium">{selectedRange ? `${selectedRange.startTime} - ${selectedRange.endTime}` : '-'}</span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-border" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-foreground-secondary">Tiền sân</span>
                                    <span>{formatCurrency(courtTotal)}</span>
                                </div>
                                {selectedAddons.map(item => (
                                    <div key={`${item.type}:${item.id}`} className="flex justify-between gap-3">
                                        <span className="text-foreground-secondary">{item.name} x{item.quantity}</span>
                                        <span>{formatCurrency(item.total)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                                    <span>Tổng tạm tính</span>
                                    <span className="text-primary-500">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-warning">
                                    <Trophy className="h-4 w-4" />
                                    <span className="text-sm">Dự kiến nhận {estimatedPoints} điểm sau khi hoàn tất.</span>
                                </div>
                            </div>

                            <Button
                                className="mt-5 w-full"
                                size="lg"
                                disabled={!canSubmit}
                                isLoading={createMutation.isPending}
                                onClick={() => createMutation.mutate()}
                            >
                                Xác nhận đặt sân
                            </Button>
                            <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate('/booking-lookup')}>
                                Tra cứu lịch đặt
                            </Button>
                        </div>
                    </aside>
                </div>
            </main>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background-secondary p-3 lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs text-foreground-secondary">Tổng tạm tính</p>
                        <p className="font-bold text-primary-500">{formatCurrency(total)}</p>
                    </div>
                    <Button disabled={!canSubmit} isLoading={createMutation.isPending} onClick={() => createMutation.mutate()}>
                        Đặt sân
                    </Button>
                </div>
            </div>
        </div>
    );
}
