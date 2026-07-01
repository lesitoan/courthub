import { Activity, Users, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface LiveStat {
    id: string;
    label: string;
    value: number | string;
    change?: number;
    icon: typeof Activity;
    color: string;
    format?: 'currency' | 'number' | 'time';
    pulse?: boolean;
}

interface LiveStatsBarProps {
    stats: LiveStat[];
    compact?: boolean;
}

function formatStatValue(value: number | string, format?: string): string {
    if (typeof value === 'string') return value;
    if (format === 'currency') return formatCurrency(value);
    if (format === 'time') {
        const hours = Math.floor(value / 60);
        const mins = value % 60;
        return `${hours}h ${mins}m`;
    }
    return value.toLocaleString('vi-VN');
}

export function LiveStatsBar({ stats, compact = false }: LiveStatsBarProps) {
    return (
        <div className={cn(
            'grid gap-4',
            compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
        )}>
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.id}
                        className={cn(
                            'relative bg-background-secondary rounded-xl border border-border p-4 transition-all hover:shadow-md',
                            stat.pulse && 'ring-2 ring-green-500/20 animate-pulse'
                        )}
                    >
                        {/* Live indicator */}
                        {stat.pulse && (
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                <span className="w-2 h-2 bg-green-500 rounded-full absolute" />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                                stat.color
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-foreground-secondary truncate">{stat.label}</p>
                                <p className="text-xl font-bold text-foreground">
                                    {formatStatValue(stat.value, stat.format)}
                                </p>
                            </div>
                        </div>

                        {/* Change indicator */}
                        {stat.change !== undefined && (
                            <div className={cn(
                                'mt-2 flex items-center gap-1 text-xs font-medium',
                                stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                            )}>
                                <TrendingUp className={cn(
                                    'w-3 h-3',
                                    stat.change < 0 && 'rotate-180'
                                )} />
                                <span>
                                    {stat.change >= 0 ? '+' : ''}{stat.change}% so với hôm qua
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Presets for common dashboard stats
export function useDashboardStats(data?: {
    activeBookings?: number;
    todayBookings?: number;
    newCustomers?: number;
    todayRevenue?: number;
    courtUsageMinutes?: number;
    pendingPayments?: number;
}): LiveStat[] {
    return [
        {
            id: 'active',
            label: 'Đang chơi',
            value: data?.activeBookings ?? 0,
            icon: Activity,
            color: 'bg-green-500/20 text-green-500',
            pulse: (data?.activeBookings ?? 0) > 0,
        },
        {
            id: 'today',
            label: 'Lịch đặt hôm nay',
            value: data?.todayBookings ?? 0,
            icon: Calendar,
            color: 'bg-blue-500/20 text-blue-500',
        },
        {
            id: 'customers',
            label: 'Khách mới hôm nay',
            value: data?.newCustomers ?? 0,
            icon: Users,
            color: 'bg-purple-500/20 text-purple-500',
        },
        {
            id: 'revenue',
            label: 'Doanh thu hôm nay',
            value: data?.todayRevenue ?? 0,
            format: 'currency',
            icon: DollarSign,
            color: 'bg-yellow-500/20 text-yellow-500',
        },
        {
            id: 'usage',
            label: 'Thời gian sử dụng',
            value: data?.courtUsageMinutes ?? 0,
            format: 'time',
            icon: Clock,
            color: 'bg-cyan-500/20 text-cyan-500',
        },
        {
            id: 'pending',
            label: 'Chờ thanh toán',
            value: data?.pendingPayments ?? 0,
            icon: DollarSign,
            color: 'bg-orange-500/20 text-orange-500',
        },
    ];
}
