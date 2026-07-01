import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Calendar,
    Users,
    Grid3X3,
    TrendingUp,
    TrendingDown,
    Clock,
    FileText,
    ChevronRight,
    BarChart3,
    PieChart as PieChartIcon,
    Activity
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { reportApi } from '@/services/report.service';
import { Button } from '@/components/ui/button';

// Period filter types
type PeriodFilter = 'day' | 'week' | 'month';

interface StatsCardProps {
    title: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    loading?: boolean;
    onClick?: () => void;
}

function StatsCard({ title, value, change, icon, trend = 'neutral', loading, onClick }: StatsCardProps) {
    return (
        <div
            className={cn(
                "bg-background-secondary border border-border rounded-xl p-5 hover:border-primary-500/50 transition-all",
                onClick && "cursor-pointer hover:shadow-lg"
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-foreground-secondary">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-background-tertiary rounded animate-pulse mt-1" />
                    ) : (
                        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                    )}
                    {change !== undefined && (
                        <div className={cn(
                            'flex items-center gap-1 mt-2 text-sm',
                            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-foreground-muted'
                        )}>
                            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                            <span>{change > 0 ? '+' : ''}{change}%</span>
                            <span className="text-foreground-muted">so với kỳ trước</span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// Enhanced Chart Component with tooltips
interface ChartDataPoint {
    label: string;
    value: number;
    date?: string;
}

function EnhancedBarChart({
    data,
    title,
    color = 'primary',
    showValues = true,
    height = 250
}: {
    data: ChartDataPoint[];
    title?: string;
    color?: 'primary' | 'success' | 'warning';
    showValues?: boolean;
    height?: number;
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const maxValue = Math.max(...data.map(d => d.value), 1);

    const colorClasses = {
        primary: 'from-primary-500 to-primary-400',
        success: 'from-green-500 to-green-400',
        warning: 'from-yellow-500 to-yellow-400',
    };

    return (
        <div>
            {title && <h3 className="font-semibold text-foreground mb-4">{title}</h3>}
            <div className="flex items-end gap-1 sm:gap-2" style={{ height }}>
                {data.map((item, i) => {
                    const percentage = (item.value / maxValue) * 100;
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-2 relative"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Tooltip */}
                            {isHovered && (
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-10 shadow-lg">
                                    <div className="font-bold">{formatCurrency(item.value)}</div>
                                    {item.date && <div className="opacity-70">{item.date}</div>}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-foreground" />
                                </div>
                            )}

                            {/* Bar */}
                            <div
                                className="relative w-full flex items-end justify-center"
                                style={{ height: height - 30 }}
                            >
                                <div
                                    className={cn(
                                        'w-full max-w-[50px] rounded-t-lg transition-all duration-300 bg-gradient-to-t',
                                        colorClasses[color],
                                        isHovered && 'opacity-80 scale-105'
                                    )}
                                    style={{ height: `${Math.max(percentage, 3)}%` }}
                                />
                            </div>

                            {/* Label */}
                            <span className={cn(
                                'text-xs transition-colors',
                                isHovered ? 'text-primary-500 font-medium' : 'text-foreground-muted'
                            )}>
                                {item.label}
                            </span>

                            {/* Value below (optional) */}
                            {showValues && (
                                <span className="text-xs text-foreground-secondary font-medium">
                                    {item.value >= 1000000
                                        ? `${(item.value / 1000000).toFixed(1)}M`
                                        : item.value >= 1000
                                            ? `${(item.value / 1000).toFixed(0)}K`
                                            : item.value}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Donut Chart for distribution
function DonutChart({
    data,
    title,
    size = 180
}: {
    data: { label: string; value: number; color: string }[];
    title?: string;
    size?: number;
}) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;

    const segments = data.map((item) => {
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        return { ...item, startAngle, angle };
    });

    const radius = size / 2;
    const strokeWidth = 30;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <div className="flex items-center gap-6">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {segments.map((segment, i) => {
                        const offset = (segment.startAngle / 360) * circumference;
                        const length = (segment.angle / 360) * circumference;

                        return (
                            <circle
                                key={i}
                                cx={radius}
                                cy={radius}
                                r={normalizedRadius}
                                fill="transparent"
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${length} ${circumference - length}`}
                                strokeDashoffset={-offset}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{total}</span>
                    <span className="text-xs text-foreground-muted">{title}</span>
                </div>
            </div>

            <div className="flex-1 space-y-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-foreground">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            {item.value} ({((item.value / total) * 100).toFixed(0)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Period Filter Tabs
function PeriodFilterTabs({
    value,
    onChange
}: {
    value: PeriodFilter;
    onChange: (value: PeriodFilter) => void;
}) {
    const options: { value: PeriodFilter; label: string }[] = [
        { value: 'day', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
    ];

    return (
        <div className="inline-flex bg-background-tertiary rounded-lg p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-md transition-all',
                        value === option.value
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'text-foreground-secondary hover:text-foreground'
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

interface BookingItemProps {
    customer: string;
    court: string;
    time: string;
    date: string;
    status: string;
    onClick?: () => void;
}

function BookingItem({ customer, court, time, status, onClick }: BookingItemProps) {
    const statusColors: Record<string, string> = {
        'CONFIRMED': 'bg-booking-confirmed',
        'IN_PROGRESS': 'bg-booking-in-progress',
        'PENDING': 'bg-booking-pending',
    };

    const statusLabels: Record<string, string> = {
        'CONFIRMED': 'Đã xác nhận',
        'IN_PROGRESS': 'Đang chơi',
        'PENDING': 'Chờ xác nhận',
    };

    return (
        <div
            className={cn(
                "flex items-center justify-between py-3 border-b border-border last:border-0",
                onClick && "cursor-pointer hover:bg-background-tertiary px-2 -mx-2 rounded-lg"
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-primary-500 font-medium text-sm">
                        {customer.charAt(0)}
                    </span>
                </div>
                <div>
                    <p className="font-medium text-foreground">{customer}</p>
                    <p className="text-sm text-foreground-muted">{court} • {time}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', statusColors[status] || 'bg-gray-400')} />
                <span className="text-sm text-foreground-secondary">{statusLabels[status] || status}</span>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('day');

    // Fetch dashboard stats based on period
    const { data: stats, isLoading: loadingStats } = useQuery({
        queryKey: ['dashboard', 'stats', periodFilter],
        queryFn: () => reportApi.getDashboardStats(),
    });

    // Fetch monthly revenue for growth %
    const { data: monthlyRevenue } = useQuery({
        queryKey: ['dashboard', 'monthly-revenue', periodFilter],
        queryFn: () => reportApi.getMonthlyRevenue(),
    });

    // Fetch upcoming bookings
    const { data: upcomingBookings, isLoading: loadingBookings } = useQuery({
        queryKey: ['dashboard', 'upcoming-bookings'],
        queryFn: () => reportApi.getUpcomingBookings(5),
    });

    // Fetch revenue chart data based on period
    const getDaysForPeriod = () => {
        switch (periodFilter) {
            case 'day': return 1;
            case 'week': return 7;
            case 'month': return 30;
        }
    };

    const { data: revenueChart } = useQuery({
        queryKey: ['dashboard', 'revenue-chart', periodFilter],
        queryFn: () => reportApi.getRevenueChart(getDaysForPeriod()),
    });

    // Chart data transformation
    const chartData: ChartDataPoint[] = revenueChart?.map((item) => ({
        label: periodFilter === 'month'
            ? item.date.split('-')[2] // Day only
            : item.date.split('-').slice(1).join('/'), // MM/DD
        value: item.revenue,
        date: item.date,
    })) || [];

    // Booking distribution mock data
    const bookingDistribution = [
        { label: 'Sáng (6-12h)', value: 25, color: '#10b981' },
        { label: 'Trưa (12-17h)', value: 15, color: '#f59e0b' },
        { label: 'Tối (17-22h)', value: 45, color: '#6366f1' },
    ];

    const statsCards = [
        {
            title: periodFilter === 'day' ? 'Doanh thu hôm nay' : periodFilter === 'week' ? 'Doanh thu tuần' : 'Doanh thu tháng',
            value: formatCurrency(stats?.todayRevenue || 0),
            change: monthlyRevenue?.growth,
            icon: <DollarSign className="w-6 h-6 text-primary-500" />,
            trend: (monthlyRevenue?.growth || 0) >= 0 ? 'up' as const : 'down' as const,
            onClick: () => navigate('/reports'),
        },
        {
            title: 'Lượt đặt sân',
            value: String(stats?.todayBookings || 0),
            icon: <Calendar className="w-6 h-6 text-primary-500" />,
            trend: 'neutral' as const,
            onClick: () => navigate('/calendar'),
        },
        {
            title: 'Khách hàng hoạt động',
            value: String(stats?.activeCustomers || 0),
            icon: <Users className="w-6 h-6 text-primary-500" />,
            trend: 'neutral' as const,
            onClick: () => navigate('/customers'),
        },
        {
            title: 'Sân trống / Đang chơi',
            value: `${stats?.courtsAvailable || 0} / ${stats?.courtsInUse || 0}`,
            icon: <Grid3X3 className="w-6 h-6 text-primary-500" />,
            trend: 'neutral' as const,
            onClick: () => navigate('/courts'),
        },
    ];

    const chartTitle = periodFilter === 'day'
        ? 'Doanh thu theo giờ'
        : periodFilter === 'week'
            ? 'Doanh thu 7 ngày qua'
            : 'Doanh thu 30 ngày qua';

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>
                    <p className="text-foreground-secondary">
                        Xin chào! Đây là tổng quan hoạt động của bạn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilterTabs value={periodFilter} onChange={setPeriodFilter} />
                    {stats?.pendingInvoices && stats.pendingInvoices > 0 && (
                        <button
                            onClick={() => navigate('/invoices')}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            {stats.pendingInvoices} chờ thanh toán
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, i) => (
                    <StatsCard key={i} {...stat} loading={loadingStats} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-background-secondary border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary-500" />
                            <h2 className="font-semibold text-foreground">{chartTitle}</h2>
                        </div>
                        <div className="text-sm text-foreground-secondary">
                            Tổng: <span className="font-semibold text-foreground">
                                {formatCurrency(revenueChart?.reduce((sum, d) => sum + d.revenue, 0) || 0)}
                            </span>
                        </div>
                    </div>

                    {chartData.length > 0 ? (
                        <EnhancedBarChart
                            data={chartData}
                            color="primary"
                            showValues={periodFilter !== 'month'}
                            height={periodFilter === 'month' ? 200 : 250}
                        />
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-foreground-muted">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Chưa có dữ liệu</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Booking Distribution Chart */}
                <div className="bg-background-secondary border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChartIcon className="w-5 h-5 text-primary-500" />
                        <h2 className="font-semibold text-foreground">Phân bổ đặt sân</h2>
                    </div>
                    <DonutChart data={bookingDistribution} title="Lượt đặt" />
                </div>
            </div>

            {/* Lower Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Bookings */}
                <div className="bg-background-secondary border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-500" />
                            <h2 className="font-semibold text-foreground">Lịch đặt sân sắp tới</h2>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
                            Xem tất cả
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    {loadingBookings ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-background-tertiary rounded animate-pulse" />
                            ))}
                        </div>
                    ) : upcomingBookings && upcomingBookings.length > 0 ? (
                        <div className="space-y-1">
                            {upcomingBookings.map((booking) => (
                                <BookingItem
                                    key={booking.id}
                                    customer={booking.customerName}
                                    court={booking.courtName}
                                    time={`${booking.startTime} - ${booking.endTime}`}
                                    date={formatDate(booking.date)}
                                    status={booking.status}
                                    onClick={() => navigate(`/calendar?booking=${booking.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-foreground-muted">
                            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Không có lịch đặt sân sắp tới</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-background-secondary border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-primary-500" />
                        <h2 className="font-semibold text-foreground">Thao tác nhanh</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/calendar')}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors">
                                <Calendar className="w-6 h-6 text-primary-500" />
                            </div>
                            <span className="text-sm font-medium">Đặt sân mới</span>
                        </button>
                        <button
                            onClick={() => navigate('/customers')}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors">
                                <Users className="w-6 h-6 text-green-500" />
                            </div>
                            <span className="text-sm font-medium">Thêm khách hàng</span>
                        </button>
                        <button
                            onClick={() => navigate('/calendar')}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 flex items-center justify-center transition-colors">
                                <Clock className="w-6 h-6 text-yellow-500" />
                            </div>
                            <span className="text-sm font-medium">Check-in</span>
                        </button>
                        <button
                            onClick={() => navigate('/invoices')}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background-tertiary hover:bg-primary-500/10 hover:text-primary-500 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                                <DollarSign className="w-6 h-6 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium">Thanh toán</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
