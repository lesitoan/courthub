import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonData {
    current: number;
    previous: number;
    label: string;
    format?: 'currency' | 'number' | 'percent';
}

interface PeriodComparisonProps {
    title: string;
    subtitle?: string;
    data: ComparisonData[];
    period?: 'day' | 'week' | 'month';
    onPeriodChange?: (period: 'day' | 'week' | 'month') => void;
}

function formatValue(value: number, format?: string): string {
    if (format === 'currency') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    }
    if (format === 'percent') {
        return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('vi-VN');
}

function getChangePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

function getChangeIcon(change: number) {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
}

function getChangeColor(change: number): string {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-foreground-muted';
}

function getChangeBg(change: number): string {
    if (change > 0) return 'bg-green-500/10';
    if (change < 0) return 'bg-red-500/10';
    return 'bg-foreground-muted/10';
}

const PERIOD_LABELS: Record<string, { current: string; previous: string }> = {
    day: { current: 'Hôm nay', previous: 'Hôm qua' },
    week: { current: 'Tuần này', previous: 'Tuần trước' },
    month: { current: 'Tháng này', previous: 'Tháng trước' },
};

const STAT_ICONS: Record<string, typeof Calendar> = {
    'Doanh thu': DollarSign,
    'Lịch đặt': Calendar,
    'Khách hàng mới': Users,
    'Giờ sử dụng': Clock,
};

export function PeriodComparison({
    title,
    subtitle,
    data,
    period = 'day',
    onPeriodChange,
}: PeriodComparisonProps) {
    const periodLabels = PERIOD_LABELS[period];

    return (
        <div className="bg-background-secondary rounded-xl border border-border p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-foreground-secondary">{subtitle}</p>
                    )}
                </div>

                {/* Period Selector */}
                {onPeriodChange && (
                    <div className="flex bg-background-tertiary rounded-lg p-1">
                        {(['day', 'week', 'month'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => onPeriodChange(p)}
                                className={cn(
                                    'px-3 py-1.5 text-sm rounded-md transition-colors',
                                    period === p
                                        ? 'bg-primary-500 text-white'
                                        : 'text-foreground-secondary hover:text-foreground'
                                )}
                            >
                                {p === 'day' ? 'Ngày' : p === 'week' ? 'Tuần' : 'Tháng'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((item, idx) => {
                    const change = getChangePercent(item.current, item.previous);
                    const ChangeIcon = getChangeIcon(change);
                    const StatIcon = STAT_ICONS[item.label] || Calendar;

                    return (
                        <div
                            key={idx}
                            className="bg-background-tertiary rounded-xl p-4 transition-all hover:shadow-md"
                        >
                            {/* Icon and Label */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                    <StatIcon className="w-4 h-4 text-primary-500" />
                                </div>
                                <span className="text-sm text-foreground-secondary">{item.label}</span>
                            </div>

                            {/* Current Value */}
                            <div className="text-2xl font-bold text-foreground mb-2">
                                {formatValue(item.current, item.format)}
                            </div>

                            {/* Change Badge */}
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                                        getChangeBg(change),
                                        getChangeColor(change)
                                    )}
                                >
                                    <ChangeIcon className="w-3 h-3" />
                                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                                </span>
                                <span className="text-xs text-foreground-muted">
                                    vs {periodLabels.previous}
                                </span>
                            </div>

                            {/* Previous Value */}
                            <p className="text-xs text-foreground-muted mt-1">
                                {periodLabels.previous}: {formatValue(item.previous, item.format)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
