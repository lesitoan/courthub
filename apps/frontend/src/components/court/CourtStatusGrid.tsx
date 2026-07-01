import { Activity, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

type CourtStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

interface CourtStatusData {
    id: string;
    name: string;
    status: CourtStatus;
    currentBooking?: {
        customerName: string;
        startTime: string;
        endTime: string;
        remainingMinutes?: number;
    };
    nextBooking?: {
        customerName: string;
        startTime: string;
    };
    todayRevenue?: number;
    todayBookingsCount?: number;
}

interface CourtStatusGridProps {
    courts: CourtStatusData[];
    onCourtClick?: (courtId: string) => void;
}

const STATUS_CONFIG = {
    available: {
        label: 'Trống',
        icon: CheckCircle,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-500',
        pulseColor: 'bg-green-500',
    },
    occupied: {
        label: 'Đang chơi',
        icon: Activity,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-500',
        pulseColor: 'bg-blue-500',
    },
    maintenance: {
        label: 'Bảo trì',
        icon: AlertTriangle,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-500',
        pulseColor: 'bg-orange-500',
    },
    reserved: {
        label: 'Đã đặt',
        icon: Clock,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-500',
        pulseColor: 'bg-purple-500',
    },
};

function formatTimeRemaining(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} phút nữa`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m nữa` : `${hours} giờ nữa`;
}

export function CourtStatusGrid({ courts, onCourtClick }: CourtStatusGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courts.map((court) => {
                const config = STATUS_CONFIG[court.status];
                const StatusIcon = config.icon;

                return (
                    <button
                        key={court.id}
                        onClick={() => onCourtClick?.(court.id)}
                        className={cn(
                            'relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg hover:scale-[1.02]',
                            config.bgColor,
                            config.borderColor
                        )}
                    >
                        {/* Status Indicator */}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                            {court.status === 'occupied' && (
                                <span className="relative flex h-3 w-3">
                                    <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)} />
                                    <span className={cn('relative inline-flex rounded-full h-3 w-3', config.pulseColor)} />
                                </span>
                            )}
                        </div>

                        {/* Court Name & Status */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold',
                                config.bgColor,
                                config.textColor
                            )}>
                                {court.name.replace(/[^0-9]/g, '') || '?'}
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">{court.name}</h3>
                                <span className={cn('inline-flex items-center gap-1 text-sm font-medium', config.textColor)}>
                                    <StatusIcon className="w-4 h-4" />
                                    {config.label}
                                </span>
                            </div>
                        </div>

                        {/* Current Booking Info */}
                        {court.status === 'occupied' && court.currentBooking && (
                            <div className="p-3 bg-background-tertiary rounded-lg mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-foreground-muted" />
                                    <span className="text-foreground font-medium truncate">
                                        {court.currentBooking.customerName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-foreground-secondary">
                                    <Clock className="w-3 h-3" />
                                    <span>{court.currentBooking.startTime} - {court.currentBooking.endTime}</span>
                                </div>
                                {court.currentBooking.remainingMinutes !== undefined && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-foreground-muted">Còn lại</span>
                                            <span className="text-blue-500 font-medium">
                                                {formatTimeRemaining(court.currentBooking.remainingMinutes)}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                style={{ width: `${Math.max(10, (court.currentBooking.remainingMinutes / 60) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Next Booking */}
                        {court.nextBooking && court.status !== 'occupied' && (
                            <div className="p-3 bg-background-tertiary rounded-lg mb-3">
                                <p className="text-xs text-foreground-muted mb-1">Lịch tiếp theo</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-foreground-muted" />
                                    <span className="text-foreground">{court.nextBooking.startTime}</span>
                                    <span className="text-foreground-secondary">-</span>
                                    <span className="text-foreground truncate">{court.nextBooking.customerName}</span>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                            <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{court.todayBookingsCount ?? 0}</p>
                                <p className="text-xs text-foreground-muted">lượt hôm nay</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-primary-500">
                                    {formatCurrency(court.todayRevenue ?? 0)}
                                </p>
                                <p className="text-xs text-foreground-muted">doanh thu</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

// Single court card for compact views
export function CourtStatusCard({ court, onClick }: { court: CourtStatusData; onClick?: () => void }) {
    const config = STATUS_CONFIG[court.status];
    const StatusIcon = config.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md',
                config.bgColor,
                config.borderColor
            )}
        >
            <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                config.textColor
            )}>
                {court.name.replace(/[^0-9]/g, '') || '?'}
            </div>
            <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-foreground truncate">{court.name}</p>
                <span className={cn('inline-flex items-center gap-1 text-xs', config.textColor)}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                </span>
            </div>
            {court.status === 'occupied' && (
                <span className="relative flex h-2 w-2">
                    <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)} />
                    <span className={cn('relative inline-flex rounded-full h-2 w-2', config.pulseColor)} />
                </span>
            )}
        </button>
    );
}
