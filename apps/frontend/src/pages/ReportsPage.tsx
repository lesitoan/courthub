import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    FileSpreadsheet
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { reportApi } from '@/services/report.service';
import { exportApi } from '@/services/export.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Simple bar component for charts
function Bar({ value, maxValue, label, color }: { value: number; maxValue: number; label: string; color: string }) {
    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-36 bg-background-tertiary rounded-lg overflow-hidden flex flex-col-reverse">
                <div
                    className={cn('w-full transition-all duration-500', color)}
                    style={{ height: `${height}%` }}
                />
            </div>
            <span className="text-xs text-foreground-secondary">{label}</span>
            <span className="text-xs text-foreground font-medium">{formatCurrency(value)}</span>
        </div>
    );
}

// Stats card component
function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color,
    loading
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    trendValue?: string;
    color: string;
    loading?: boolean;
}) {
    return (
        <div className="bg-background-secondary border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-foreground-secondary text-sm">{title}</p>
                    {loading ? (
                        <div className="h-8 w-24 bg-background-tertiary rounded animate-pulse mt-1" />
                    ) : (
                        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                    )}
                    {trend && trendValue && (
                        <div className={cn(
                            'flex items-center gap-1 text-sm mt-2',
                            trend === 'up' ? 'text-green-400' : 'text-red-400'
                        )}>
                            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <div className={cn('p-3 rounded-lg', color)}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
    const { toast } = useToast();

    // Fetch dashboard stats
    const { data: dashboardStats, isLoading: loadingStats } = useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => reportApi.getDashboardStats(),
    });

    // Fetch monthly revenue
    const { data: monthlyRevenue } = useQuery({
        queryKey: ['dashboard', 'monthly-revenue'],
        queryFn: () => reportApi.getMonthlyRevenue(),
    });

    // Fetch revenue chart
    const { data: revenueChart } = useQuery({
        queryKey: ['dashboard', 'revenue-chart', 7],
        queryFn: () => reportApi.getRevenueChart(7),
    });

    // Fetch top customers
    const { data: topCustomers } = useQuery({
        queryKey: ['reports', 'top-customers'],
        queryFn: () => reportApi.getTopCustomers(5),
    });

    // Export mutations
    const exportInvoicesMutation = useMutation({
        mutationFn: () => exportApi.exportInvoices(),
        onSuccess: () => toast({ title: 'Đã tải xuống file Excel hóa đơn' }),
        onError: () => toast({ title: 'Lỗi khi xuất file', variant: 'error' }),
    });

    const exportBookingsMutation = useMutation({
        mutationFn: () => exportApi.exportBookings(),
        onSuccess: () => toast({ title: 'Đã tải xuống file Excel đặt sân' }),
        onError: () => toast({ title: 'Lỗi khi xuất file', variant: 'error' }),
    });

    const exportCustomersMutation = useMutation({
        mutationFn: () => exportApi.exportCustomers(),
        onSuccess: () => toast({ title: 'Đã tải xuống file Excel khách hàng' }),
        onError: () => toast({ title: 'Lỗi khi xuất file', variant: 'error' }),
    });

    const exportRevenueMutation = useMutation({
        mutationFn: () => exportApi.exportRevenueReport(),
        onSuccess: () => toast({ title: 'Đã tải xuống báo cáo doanh thu' }),
        onError: () => toast({ title: 'Lỗi khi xuất file', variant: 'error' }),
    });

    // Chart data
    const chartData = revenueChart || [];
    const maxRevenue = chartData.length > 0 ? Math.max(...chartData.map(d => d.revenue)) : 0;

    return (
        <div className="flex flex-col h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Báo Cáo & Thống Kê</h1>
                    <p className="text-foreground-secondary">Phân tích doanh thu và hoạt động</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Export dropdown */}
                    <div className="relative group">
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Xuất Excel
                        </Button>
                        <div className="absolute right-0 top-full mt-2 w-56 bg-background-secondary border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => exportInvoicesMutation.mutate()}
                                    disabled={exportInvoicesMutation.isPending}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Xuất hóa đơn
                                </button>
                                <button
                                    onClick={() => exportBookingsMutation.mutate()}
                                    disabled={exportBookingsMutation.isPending}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Xuất đặt sân
                                </button>
                                <button
                                    onClick={() => exportCustomersMutation.mutate()}
                                    disabled={exportCustomersMutation.isPending}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Xuất khách hàng
                                </button>
                                <div className="border-t border-border my-1" />
                                <button
                                    onClick={() => exportRevenueMutation.mutate()}
                                    disabled={exportRevenueMutation.isPending}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-background-hover rounded-lg text-primary-500"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Báo cáo doanh thu tháng
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Period selector */}
                    <div className="flex bg-background-secondary border border-border rounded-lg overflow-hidden">
                        {(['today', 'week', 'month'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    'px-4 py-2 text-sm transition-colors',
                                    period === p
                                        ? 'bg-primary-500 text-white'
                                        : 'text-foreground-secondary hover:bg-background-hover'
                                )}
                            >
                                {p === 'today' ? 'Hôm nay' : p === 'week' ? 'Tuần' : 'Tháng'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Doanh thu hôm nay"
                    value={formatCurrency(dashboardStats?.todayRevenue || 0)}
                    icon={DollarSign}
                    trend={monthlyRevenue?.growth && monthlyRevenue.growth >= 0 ? 'up' : 'down'}
                    trendValue={`${monthlyRevenue?.growth || 0}% so với tháng trước`}
                    color="bg-primary-500/20 text-primary-500"
                    loading={loadingStats}
                />
                <StatCard
                    title="Lượt đặt sân"
                    value={String(dashboardStats?.todayBookings || 0)}
                    icon={Calendar}
                    color="bg-blue-500/20 text-blue-400"
                    loading={loadingStats}
                />
                <StatCard
                    title="Khách hàng"
                    value={String(dashboardStats?.activeCustomers || 0)}
                    icon={Users}
                    color="bg-green-500/20 text-green-400"
                    loading={loadingStats}
                />
                <StatCard
                    title="Doanh thu tháng này"
                    value={formatCurrency(monthlyRevenue?.currentMonth || 0)}
                    icon={TrendingUp}
                    color="bg-purple-500/20 text-purple-400"
                />
            </div>

            {/* Weekly Revenue Chart */}
            <div className="bg-background-secondary border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-500" />
                        <h3 className="font-semibold text-foreground">Doanh thu 7 ngày qua</h3>
                    </div>
                    <span className="text-sm text-foreground-secondary">
                        Tổng: {formatCurrency(chartData.reduce((s, d) => s + d.revenue, 0))}
                    </span>
                </div>
                <div className="flex items-end justify-around">
                    {chartData.map((data, i) => (
                        <Bar
                            key={i}
                            value={data.revenue}
                            maxValue={maxRevenue}
                            label={data.date}
                            color="bg-primary-500"
                        />
                    ))}
                </div>
            </div>

            {/* Top Customers */}
            <div className="bg-background-secondary border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Top khách hàng chi tiêu</h3>
                <div className="space-y-3">
                    {topCustomers?.map((customer, i) => (
                        <div key={customer.id} className="flex items-center gap-4">
                            <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-500 text-sm flex items-center justify-center font-medium">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <span className="text-foreground font-medium">{customer.name}</span>
                                        {customer.membershipTier && (
                                            <span className={cn(
                                                'ml-2 px-2 py-0.5 text-xs rounded',
                                                customer.membershipTier === 'GOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    customer.membershipTier === 'SILVER' ? 'bg-gray-400/20 text-gray-400' :
                                                        'bg-amber-700/20 text-amber-600'
                                            )}>
                                                {customer.membershipTier}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-foreground-secondary">{customer.totalBookings} lượt</span>
                                </div>
                                <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-500 rounded-full transition-all"
                                        style={{ width: `${(customer.totalSpent / (topCustomers[0]?.totalSpent || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-foreground font-medium w-28 text-right">{formatCurrency(customer.totalSpent)}</span>
                        </div>
                    ))}
                    {(!topCustomers || topCustomers.length === 0) && (
                        <p className="text-center text-foreground-muted py-4">Chưa có dữ liệu khách hàng</p>
                    )}
                </div>
            </div>
        </div>
    );
}
