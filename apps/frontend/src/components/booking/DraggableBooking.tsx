import { useState } from 'react';
import { User, Clock, GripVertical, Check, X } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DraggableBooking {
    id: string;
    customerName: string;
    startTime: string;
    endTime: string;
    courtId: string;
    courtName: string;
    status: 'CONFIRMED' | 'CHECKED_IN' | 'PENDING';
    amount: number;
}

interface DropTarget {
    courtId: string;
    timeSlot: string;
}

interface DraggableBookingCardProps {
    booking: DraggableBooking;
    onDragStart?: (booking: DraggableBooking) => void;
    onDragEnd?: () => void;
    isDragging?: boolean;
    isGhost?: boolean;
}

export function DraggableBookingCard({
    booking,
    onDragStart,
    onDragEnd,
    isDragging = false,
    isGhost = false,
}: DraggableBookingCardProps) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify(booking));
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(booking);
    };

    const handleDragEnd = () => {
        onDragEnd?.();
    };

    return (
        <div
            draggable={booking.status === 'CONFIRMED'}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={cn(
                'group relative p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing',
                booking.status === 'CONFIRMED' && 'bg-blue-500/10 border-blue-500/30 hover:shadow-md',
                booking.status === 'CHECKED_IN' && 'bg-green-500/10 border-green-500/30',
                booking.status === 'PENDING' && 'bg-yellow-500/10 border-yellow-500/30',
                isDragging && 'opacity-50 scale-95',
                isGhost && 'border-dashed border-2 border-primary-500 bg-primary-500/5'
            )}
        >
            {/* Drag Handle */}
            {booking.status === 'CONFIRMED' && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-foreground-muted" />
                </div>
            )}

            {/* Content */}
            <div className={cn(booking.status === 'CONFIRMED' && 'pl-4')}>
                <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-foreground-muted" />
                    <span className="font-medium text-foreground truncate">{booking.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <Clock className="w-3 h-3" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-primary-500">
                    {formatCurrency(booking.amount)}
                </div>
            </div>
        </div>
    );
}

// Drop zone for calendar cells
interface DroppableZoneProps {
    courtId: string;
    timeSlot: string;
    onDrop: (booking: DraggableBooking, target: DropTarget) => void;
    children?: React.ReactNode;
    isOccupied?: boolean;
}

export function DroppableZone({
    courtId,
    timeSlot,
    onDrop,
    children,
    isOccupied = false,
}: DroppableZoneProps) {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        if (isOccupied) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);

        if (isOccupied) return;

        try {
            const data = e.dataTransfer.getData('application/json');
            const booking = JSON.parse(data) as DraggableBooking;
            onDrop(booking, { courtId, timeSlot });
        } catch (error) {
            console.error('Failed to parse drop data:', error);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                'min-h-[60px] transition-all',
                isOver && !isOccupied && 'bg-primary-500/10 ring-2 ring-primary-500 ring-inset rounded-lg'
            )}
        >
            {children}
        </div>
    );
}

// Confirmation dialog for move
interface MoveConfirmDialogProps {
    isOpen: boolean;
    booking: DraggableBooking | null;
    target: DropTarget | null;
    courtName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function MoveConfirmDialog({
    isOpen,
    booking,
    target,
    courtName,
    onConfirm,
    onCancel,
}: MoveConfirmDialogProps) {
    if (!isOpen || !booking || !target) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50" onClick={onCancel} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-4">
                <div className="bg-background-secondary rounded-xl border border-border shadow-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Xác nhận di chuyển</h3>
                    <p className="text-foreground-secondary mb-4">
                        Di chuyển lịch đặt của <strong>{booking.customerName}</strong> đến:
                    </p>
                    <div className="bg-background-tertiary rounded-lg p-3 mb-4">
                        <p className="font-medium text-foreground">{courtName}</p>
                        <p className="text-sm text-foreground-secondary">{target.timeSlot}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1 gap-2" onClick={onCancel}>
                            <X className="w-4 h-4" />
                            Hủy
                        </Button>
                        <Button className="flex-1 gap-2" onClick={onConfirm}>
                            <Check className="w-4 h-4" />
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
