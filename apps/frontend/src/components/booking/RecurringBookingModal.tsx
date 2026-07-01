import { useState } from 'react';
import { X, Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecurringBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    courts: { id: string; name: string }[];
    onSubmit: (data: RecurringBookingInput) => void;
    isLoading?: boolean;
}

export interface RecurringBookingInput {
    courtId: string;
    customerId?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    totalAmount: number;
    notes?: string;
}

const WEEKDAYS = [
    { value: 0, label: 'CN', fullLabel: 'Chủ nhật' },
    { value: 1, label: 'T2', fullLabel: 'Thứ 2' },
    { value: 2, label: 'T3', fullLabel: 'Thứ 3' },
    { value: 3, label: 'T4', fullLabel: 'Thứ 4' },
    { value: 4, label: 'T5', fullLabel: 'Thứ 5' },
    { value: 5, label: 'T6', fullLabel: 'Thứ 6' },
    { value: 6, label: 'T7', fullLabel: 'Thứ 7' },
];

const TIME_OPTIONS = Array.from({ length: 34 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

export function RecurringBookingModal({
    isOpen,
    onClose,
    courts,
    onSubmit,
    isLoading = false,
}: RecurringBookingModalProps) {
    const [formData, setFormData] = useState<RecurringBookingInput>({
        courtId: courts[0]?.id || '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        startTime: '18:00',
        endTime: '20:00',
        daysOfWeek: [],
        totalAmount: 0,
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const toggleDay = (day: number) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day].sort(),
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.courtId) newErrors.courtId = 'Vui lòng chọn sân';
        if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
        if (formData.daysOfWeek.length === 0) newErrors.daysOfWeek = 'Vui lòng chọn ít nhất 1 ngày trong tuần';
        if (formData.startTime >= formData.endTime) newErrors.time = 'Giờ kết thúc phải sau giờ bắt đầu';
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    // Calculate estimated bookings count
    const estimateBookingsCount = (): number => {
        if (!formData.startDate || !formData.endDate || formData.daysOfWeek.length === 0) {
            return 0;
        }

        let count = 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (formData.daysOfWeek.includes(d.getDay())) {
                count++;
            }
        }

        return count;
    };

    const estimatedCount = estimateBookingsCount();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background-secondary border border-border rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background-secondary flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Repeat className="w-5 h-5 text-primary-500" />
                        <h2 className="text-lg font-semibold text-foreground">
                            Đặt sân định kỳ
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground-secondary" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Court selection */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Chọn sân
                        </label>
                        <select
                            value={formData.courtId}
                            onChange={(e) => setFormData(prev => ({ ...prev, courtId: e.target.value }))}
                            className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {courts.map(court => (
                                <option key={court.id} value={court.id}>{court.name}</option>
                            ))}
                        </select>
                        {errors.courtId && (
                            <p className="mt-1 text-xs text-error">{errors.courtId}</p>
                        )}
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-xs text-error">{errors.startDate}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-xs text-error">{errors.endDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Time range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Giờ bắt đầu
                            </label>
                            <select
                                value={formData.startTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {TIME_OPTIONS.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Giờ kết thúc
                            </label>
                            <select
                                value={formData.endTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {TIME_OPTIONS.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.time && (
                        <p className="text-xs text-error">{errors.time}</p>
                    )}

                    {/* Days of week */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Chọn ngày trong tuần
                        </label>
                        <div className="flex gap-2">
                            {WEEKDAYS.map(day => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    title={day.fullLabel}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                                        formData.daysOfWeek.includes(day.value)
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-background-tertiary text-foreground-secondary hover:text-foreground'
                                    )}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                        {errors.daysOfWeek && (
                            <p className="mt-1 text-xs text-error">{errors.daysOfWeek}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Ghi chú
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Ghi chú về lịch đặt định kỳ..."
                            rows={2}
                            className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                    </div>

                    {/* Summary */}
                    {estimatedCount > 0 && (
                        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-primary-500 mt-0.5" />
                                <div className="text-sm text-foreground">
                                    <p className="font-medium">
                                        Sẽ tạo {estimatedCount} lịch đặt sân
                                    </p>
                                    <p className="text-foreground-secondary mt-1">
                                        Vào các ngày {formData.daysOfWeek.map(d => WEEKDAYS.find(w => w.value === d)?.fullLabel).join(', ')}
                                        {' '}từ {formData.startTime} đến {formData.endTime}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            isLoading={isLoading}
                        >
                            Tạo lịch định kỳ
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
