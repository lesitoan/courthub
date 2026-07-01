import { useState, useEffect } from 'react';
import { X, Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { bookingApi, Booking, AvailabilityResult } from '@/services/booking.service';
import { useToast } from '@/hooks/use-toast';

interface EditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onSuccess: () => void;
}

export function EditBookingModal({ isOpen, onClose, booking, onSuccess }: EditBookingModalProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [availability, setAvailability] = useState<AvailabilityResult | null>(null);

    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        notes: '',
    });

    // Initialize form data when booking changes
    useEffect(() => {
        if (booking) {
            setFormData({
                startTime: booking.startTime,
                endTime: booking.endTime,
                notes: booking.notes || '',
            });
            setAvailability(null);
        }
    }, [booking]);

    // Check availability when time changes
    useEffect(() => {
        if (!booking || !formData.startTime || !formData.endTime) return;

        // Only check if time actually changed
        if (formData.startTime === booking.startTime && formData.endTime === booking.endTime) {
            setAvailability({ available: true, conflicts: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingAvailability(true);
            try {
                const result = await bookingApi.checkAvailability(
                    booking.courtId,
                    booking.date,
                    formData.startTime,
                    formData.endTime
                );
                // Filter out current booking from conflicts
                const filteredConflicts = result.conflicts.filter(c => c.id !== booking.id);
                setAvailability({
                    available: filteredConflicts.length === 0,
                    conflicts: filteredConflicts
                });
            } catch {
                setAvailability(null);
            } finally {
                setLoadingAvailability(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [booking, formData.startTime, formData.endTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!booking) return;

        if (availability && !availability.available) {
            toast({ title: 'Khung giờ đã có người đặt', variant: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            await bookingApi.update(booking.id, {
                startTime: formData.startTime,
                endTime: formData.endTime,
                notes: formData.notes,
            });
            toast({ title: 'Cập nhật thành công!' });
            onSuccess();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể cập nhật lịch đặt';
            toast({ title: message, variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !booking) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-background-secondary rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Chỉnh sửa lịch đặt</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                        >
                            <X className="w-5 h-5 text-foreground-secondary" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Booking Info (Read-only) */}
                        <div className="bg-background-tertiary rounded-lg p-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Sân</span>
                                <span className="font-medium text-foreground">{booking.court?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Ngày</span>
                                <span className="font-medium text-foreground">
                                    {new Date(booking.date).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-foreground-secondary">Khách hàng</span>
                                <span className="font-medium text-foreground">
                                    {booking.customer?.name || 'Khách vãng lai'}
                                </span>
                            </div>
                        </div>

                        {/* Editable Time */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Giờ bắt đầu
                                </label>
                                <Input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                    Giờ kết thúc
                                </label>
                                <Input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Availability check */}
                        <div className={cn(
                            "p-3 rounded-lg border flex items-center gap-3",
                            loadingAvailability ? 'border-border bg-background-tertiary' :
                                availability?.available ? 'border-green-500/30 bg-green-500/10' :
                                    availability === null ? 'border-border bg-background-tertiary' :
                                        'border-red-500/30 bg-red-500/10'
                        )}>
                            {loadingAvailability ? (
                                <>
                                    <Loader2 className="w-5 h-5 text-foreground-secondary animate-spin" />
                                    <span className="text-foreground-secondary text-sm">Đang kiểm tra...</span>
                                </>
                            ) : availability?.available ? (
                                <>
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-green-400 text-sm">Khung giờ có thể cập nhật</span>
                                </>
                            ) : availability === null ? (
                                <span className="text-foreground-secondary text-sm">Thay đổi giờ để kiểm tra</span>
                            ) : (
                                <>
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <span className="text-red-400 text-sm">
                                        Khung giờ đã có người đặt
                                        {availability.conflicts.length > 0 && (
                                            <span> ({availability.conflicts.map(c => `${c.startTime}-${c.endTime}`).join(', ')})</span>
                                        )}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                Ghi chú
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                rows={3}
                                placeholder="Nhập ghi chú..."
                            />
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-background-tertiary">
                        <Button variant="secondary" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={isSubmitting || loadingAvailability || (availability !== null && !availability.available)}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
