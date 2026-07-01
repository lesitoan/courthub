import { useState } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    CreditCard,
    Check,
    ChevronRight,
    ChevronLeft,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';

interface Court {
    id: string;
    name: string;
    hourlyRate: number;
    peakHourRate: number;
    image?: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
    isPeak: boolean;
}

interface PublicBookingFormProps {
    venueName: string;
    venueAddress: string;
    courts: Court[];
    availableSlots: Record<string, TimeSlot[]>;
    onSubmit: (booking: PublicBookingData) => Promise<void>;
    onDateChange: (date: string) => void;
}

interface PublicBookingData {
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    paymentMethod: string;
}

type BookingStep = 'court' | 'time' | 'info' | 'confirm';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Tiền mặt', icon: '💵' },
    { id: 'bank', label: 'Chuyển khoản', icon: '🏦' },
    { id: 'momo', label: 'Ví MoMo', icon: '💜' },
];

export function PublicBookingForm({
    venueName,
    venueAddress,
    courts,
    availableSlots,
    onSubmit,
    onDateChange,
}: PublicBookingFormProps) {
    const [step, setStep] = useState<BookingStep>('court');
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        notes: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate pricing
    const slots = selectedCourt ? availableSlots[selectedCourt.id] || [] : [];
    const selectedSlotDetails = slots.filter(s => selectedSlots.includes(s.time));
    const totalPrice = selectedSlotDetails.reduce((sum, slot) => {
        const rate = slot.isPeak ? selectedCourt!.peakHourRate : selectedCourt!.hourlyRate;
        return sum + rate;
    }, 0);

    const handleNext = () => {
        const steps: BookingStep[] = ['court', 'time', 'info', 'confirm'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const steps: BookingStep[] = ['court', 'time', 'info', 'confirm'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) {
            setStep(steps[currentIndex - 1]);
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlots([]);
        onDateChange(date);
    };

    const handleSlotToggle = (time: string) => {
        setSelectedSlots(prev => {
            if (prev.includes(time)) {
                return prev.filter(t => t !== time);
            }
            // Allow consecutive slots only
            if (prev.length === 0) return [time];
            const sortedSlots = [...prev, time].sort();
            // Validate consecutive
            return sortedSlots;
        });
    };

    const handleSubmit = async () => {
        if (!selectedCourt || selectedSlots.length === 0) return;

        setIsSubmitting(true);
        try {
            const sortedSlots = [...selectedSlots].sort();
            await onSubmit({
                courtId: selectedCourt.id,
                date: selectedDate,
                startTime: sortedSlots[0],
                endTime: addHour(sortedSlots[sortedSlots.length - 1]),
                customerName: customerInfo.name,
                customerPhone: customerInfo.phone,
                customerEmail: customerInfo.email || undefined,
                notes: customerInfo.notes || undefined,
                paymentMethod,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 'court':
                return selectedCourt !== null;
            case 'time':
                return selectedSlots.length > 0;
            case 'info':
                return customerInfo.name.trim() !== '' && customerInfo.phone.trim().length >= 10;
            case 'confirm':
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500/5 via-background to-primary-600/5">
            {/* Header */}
            <div className="bg-background-secondary border-b border-border sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white text-2xl">
                            🏸
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{venueName}</h1>
                            <p className="text-sm text-foreground-secondary flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {venueAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                    {[
                        { key: 'court', label: 'Chọn sân' },
                        { key: 'time', label: 'Chọn giờ' },
                        { key: 'info', label: 'Thông tin' },
                        { key: 'confirm', label: 'Xác nhận' },
                    ].map((s, i) => (
                        <div key={s.key} className="flex items-center">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                                    step === s.key
                                        ? 'bg-primary-500 text-white'
                                        : ['court', 'time', 'info', 'confirm'].indexOf(step) > i
                                            ? 'bg-green-500 text-white'
                                            : 'bg-background-tertiary text-foreground-muted'
                                )}
                            >
                                {['court', 'time', 'info', 'confirm'].indexOf(step) > i ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 3 && (
                                <div
                                    className={cn(
                                        'w-12 sm:w-20 h-1 mx-2 rounded',
                                        ['court', 'time', 'info', 'confirm'].indexOf(step) > i
                                            ? 'bg-green-500'
                                            : 'bg-background-tertiary'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-background-secondary rounded-2xl border border-border p-6">
                    {/* Step 1: Court Selection */}
                    {step === 'court' && (
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Chọn sân</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {courts.map((court) => (
                                    <button
                                        key={court.id}
                                        onClick={() => setSelectedCourt(court)}
                                        className={cn(
                                            'p-4 rounded-xl border-2 text-left transition-all',
                                            selectedCourt?.id === court.id
                                                ? 'bg-primary-500/10 border-primary-500'
                                                : 'bg-background-tertiary border-transparent hover:border-primary-500/50'
                                        )}
                                    >
                                        <div className="aspect-video bg-background-hover rounded-lg mb-3 flex items-center justify-center text-4xl">
                                            🏸
                                        </div>
                                        <h3 className="font-semibold text-foreground">{court.name}</h3>
                                        <p className="text-sm text-primary-500 font-medium">
                                            {formatCurrency(court.hourlyRate)}/giờ
                                        </p>
                                        {court.peakHourRate > court.hourlyRate && (
                                            <p className="text-xs text-foreground-muted">
                                                Giờ cao điểm: {formatCurrency(court.peakHourRate)}/giờ
                                            </p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Time Selection */}
                    {step === 'time' && (
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Chọn ngày và giờ</h2>

                            {/* Date Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Ngày đặt sân
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-background-tertiary border border-border rounded-xl"
                                />
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Chọn khung giờ ({selectedSlots.length} slot)
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.time}
                                            onClick={() => slot.available && handleSlotToggle(slot.time)}
                                            disabled={!slot.available}
                                            className={cn(
                                                'py-3 rounded-lg text-sm font-medium transition-all',
                                                !slot.available && 'bg-background-tertiary text-foreground-muted cursor-not-allowed line-through',
                                                slot.available && !selectedSlots.includes(slot.time) && 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
                                                selectedSlots.includes(slot.time) && 'bg-primary-500 text-white',
                                                slot.isPeak && slot.available && !selectedSlots.includes(slot.time) && 'ring-1 ring-orange-500'
                                            )}
                                        >
                                            {slot.time}
                                            {slot.isPeak && slot.available && (
                                                <span className="text-xs block opacity-70">Cao điểm</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary */}
                            {selectedSlots.length > 0 && (
                                <div className="mt-6 p-4 bg-primary-500/10 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-foreground">Tổng tiền ({selectedSlots.length} giờ)</span>
                                        <span className="text-xl font-bold text-primary-500">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Customer Info */}
                    {step === 'info' && (
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Thông tin liên hệ</h2>
                            <div className="space-y-4">
                                <Input
                                    label="Họ tên *"
                                    placeholder="Nguyễn Văn A"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    label="Số điện thoại *"
                                    placeholder="0912 345 678"
                                    type="tel"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                                />
                                <Input
                                    label="Email (không bắt buộc)"
                                    placeholder="email@example.com"
                                    type="email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        placeholder="Yêu cầu đặc biệt..."
                                        value={customerInfo.notes}
                                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-4 py-3 bg-background-tertiary border border-border rounded-xl min-h-[100px]"
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        <CreditCard className="w-4 h-4 inline mr-1" />
                                        Phương thức thanh toán
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {PAYMENT_METHODS.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={cn(
                                                    'p-3 rounded-xl border-2 text-center transition-all',
                                                    paymentMethod === method.id
                                                        ? 'bg-primary-500/10 border-primary-500'
                                                        : 'bg-background-tertiary border-transparent'
                                                )}
                                            >
                                                <span className="text-2xl block mb-1">{method.icon}</span>
                                                <span className="text-sm">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 'confirm' && (
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Xác nhận đặt sân</h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-background-tertiary rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Sân</span>
                                        <span className="font-medium text-foreground">{selectedCourt?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Ngày</span>
                                        <span className="font-medium text-foreground">{selectedDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Thời gian</span>
                                        <span className="font-medium text-foreground">
                                            {selectedSlots.sort()[0]} - {addHour(selectedSlots.sort()[selectedSlots.length - 1])}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Khách hàng</span>
                                        <span className="font-medium text-foreground">{customerInfo.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Số điện thoại</span>
                                        <span className="font-medium text-foreground">{customerInfo.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Thanh toán</span>
                                        <span className="font-medium text-foreground">
                                            {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary-500/10 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium text-foreground">Tổng tiền</span>
                                        <span className="text-2xl font-bold text-primary-500">
                                            {formatCurrency(totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-foreground-secondary text-center">
                                    Bằng việc xác nhận, bạn đồng ý với điều khoản dịch vụ của {venueName}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-6">
                    {step !== 'court' && (
                        <Button variant="ghost" className="flex-1 gap-2" onClick={handleBack}>
                            <ChevronLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                    )}
                    {step !== 'confirm' ? (
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            Tiếp tục
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt sân'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper function
function addHour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
