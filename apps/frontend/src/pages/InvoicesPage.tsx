import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Receipt,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Clock,
    Eye,
    X,
    CreditCard,
    Ban,
    RotateCcw,
    Printer,
    TrendingUp,
    Download
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { invoiceApi, Invoice } from '@/services/invoice.service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { exportReport } from '@/services/export.service';

// Date period filter type
type DatePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

function getStatusInfo(paymentStatus: string) {
    switch (paymentStatus) {
        case 'PAID':
            return {
                label: 'Đã thanh toán',
                color: 'bg-green-500/20 text-green-400 border-green-500',
                icon: CheckCircle
            };
        case 'REFUNDED':
            return {
                label: 'Đã hoàn',
                color: 'bg-red-500/20 text-red-400 border-red-500',
                icon: RotateCcw
            };
        case 'PARTIAL':
            return {
                label: 'Thanh toán 1 phần',
                color: 'bg-orange-500/20 text-orange-400 border-orange-500',
                icon: Clock
            };
        default:
            return {
                label: 'Chờ thanh toán',
                color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
                icon: Clock
            };
    }
}

// Get date range for period
function getDateRange(period: DatePeriod): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    switch (period) {
        case 'today':
            break;
        case 'week':
            start.setDate(start.getDate() - 7);
            break;
        case 'month':
            start.setMonth(start.getMonth() - 1);
            break;
        case 'quarter':
            start.setMonth(start.getMonth() - 3);
            break;
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
        case 'custom':
            start.setMonth(start.getMonth() - 1);
            break;
    }

    return { start, end };
}

// Period Filter Tabs
function PeriodFilter({
    value,
    onChange
}: {
    value: DatePeriod;
    onChange: (value: DatePeriod) => void;
}) {
    const options: { value: DatePeriod; label: string }[] = [
        { value: 'today', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần' },
        { value: 'month', label: 'Tháng' },
        { value: 'quarter', label: 'Quý' },
        { value: 'year', label: 'Năm' },
    ];

    return (
        <div className="inline-flex bg-background-tertiary rounded-lg p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
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

export default function InvoicesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [datePeriod, setDatePeriod] = useState<DatePeriod>('month');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const { toast } = useToast();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get date range
    const dateRange = useMemo(() => getDateRange(datePeriod), [datePeriod]);

    // Fetch invoices
    const { data: invoicesData, isLoading } = useQuery({
        queryKey: ['invoices', statusFilter, datePeriod, page],
        queryFn: () => invoiceApi.getAll({
            paymentStatus: statusFilter || undefined,
            startDate: dateRange.start.toISOString(),
            endDate: dateRange.end.toISOString(),
            page,
            limit: 15,
        }),
    });

    // Pay mutation
    const payMutation = useMutation({
        mutationFn: (id: string) => invoiceApi.pay(id),
        onSuccess: () => {
            toast({ title: 'Thanh toán thành công!', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            setSelectedInvoice(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi thanh toán', variant: 'error' });
        },
    });

    // Cancel mutation
    const cancelMutation = useMutation({
        mutationFn: (id: string) => invoiceApi.cancel(id),
        onSuccess: () => {
            toast({ title: 'Đã hủy hóa đơn!', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            setSelectedInvoice(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi hủy', variant: 'error' });
        },
    });

    const handleExport = async () => {
        try {
            await exportReport({
                reportType: 'bookings',
                format: 'csv',
                dateRange: {
                    start: dateRange.start.toISOString().split('T')[0],
                    end: dateRange.end.toISOString().split('T')[0],
                },
            });
            toast({ title: 'Đã xuất báo cáo!', variant: 'success' });
        } catch {
            toast({ title: 'Lỗi khi xuất báo cáo', variant: 'error' });
        }
    };

    // Calculate stats
    const stats = useMemo(() => ({
        total: invoicesData?.pagination.total || 0,
        pending: invoicesData?.data.filter(i => i.paymentStatus === 'PENDING').length || 0,
        paid: invoicesData?.data.filter(i => i.paymentStatus === 'PAID').length || 0,
        totalRevenue: invoicesData?.data.filter(i => i.paymentStatus === 'PAID').reduce((sum, i) => sum + i.total, 0) || 0,
    }), [invoicesData]);

    // Filter by search
    const filteredInvoices = invoicesData?.data.filter(invoice =>
        !searchQuery || invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Get period label
    const getPeriodLabel = () => {
        switch (datePeriod) {
            case 'today': return 'hôm nay';
            case 'week': return '7 ngày qua';
            case 'month': return '30 ngày qua';
            case 'quarter': return '3 tháng qua';
            case 'year': return '1 năm qua';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col h-full p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Hóa đơn</h1>
                    <p className="text-foreground-secondary">Quản lý hóa đơn và thanh toán</p>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter value={datePeriod} onChange={setDatePeriod} />
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-background-secondary border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-1">
                        <Receipt className="w-4 h-4" />
                        Tổng hóa đơn
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-xs text-foreground-muted mt-1">{getPeriodLabel()}</div>
                </div>
                <div className="bg-background-secondary border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        Chờ thanh toán
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                </div>
                <div className="bg-background-secondary border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-1">
                        <CheckCircle className="w-4 h-4" />
                        Đã thanh toán
                    </div>
                    <div className="text-2xl font-bold text-green-400">{stats.paid}</div>
                </div>
                <div className="bg-background-secondary border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-foreground-secondary text-sm mb-1">
                        <TrendingUp className="w-4 h-4" />
                        Doanh thu
                    </div>
                    <div className="text-2xl font-bold text-primary-500">{formatCurrency(stats.totalRevenue)}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Status filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="PAID">Đã thanh toán</option>
                    <option value="PARTIAL">Thanh toán 1 phần</option>
                    <option value="REFUNDED">Đã hoàn</option>
                </select>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã hóa đơn..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Invoice List */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                    </div>
                ) : !filteredInvoices.length ? (
                    <div className="flex flex-col items-center justify-center h-64 text-foreground-secondary">
                        <Receipt className="w-12 h-12 mb-4 opacity-50" />
                        <p>Chưa có hóa đơn nào</p>
                    </div>
                ) : (
                    <div className="bg-background-secondary border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-background-tertiary">
                                        <th className="text-left px-4 py-3 text-sm font-medium text-foreground-secondary">Mã HĐ</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-foreground-secondary">Khách hàng</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-foreground-secondary">Tổng tiền</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-foreground-secondary">Trạng thái</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-foreground-secondary">Ngày tạo</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-foreground-secondary">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.map((invoice) => {
                                        const statusInfo = getStatusInfo(invoice.paymentStatus);
                                        const StatusIcon = statusInfo.icon;
                                        return (
                                            <tr key={invoice.id} className="border-b border-border/50 hover:bg-background-hover transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className="font-mono text-sm text-foreground">{invoice.invoiceNumber}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <div className="text-foreground">{invoice.customer?.name || 'Khách lẻ'}</div>
                                                        {invoice.customer?.phone && (
                                                            <div className="text-sm text-foreground-secondary">{invoice.customer.phone}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-primary-500">{formatCurrency(invoice.total)}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border',
                                                        statusInfo.color
                                                    )}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-foreground-secondary">
                                                    {formatDate(new Date(invoice.createdAt))}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setSelectedInvoice(invoice)}
                                                            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4 text-foreground-secondary" />
                                                        </button>
                                                        {invoice.paymentStatus === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => payMutation.mutate(invoice.id)}
                                                                    className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
                                                                    title="Thanh toán"
                                                                >
                                                                    <CreditCard className="w-4 h-4 text-green-400" />
                                                                </button>
                                                                <button
                                                                    onClick={() => cancelMutation.mutate(invoice.id)}
                                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                    title="Hủy"
                                                                >
                                                                    <Ban className="w-4 h-4 text-red-400" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {invoicesData && invoicesData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-foreground-secondary">
                        Hiển thị {invoicesData.data.length} / {invoicesData.pagination.total} hóa đơn
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm">
                            Trang {page} / {invoicesData.pagination.totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage(p => Math.min(invoicesData.pagination.totalPages, p + 1))}
                            disabled={page === invoicesData.pagination.totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-background-secondary border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-auto animate-scaleIn">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background-secondary z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Chi tiết hóa đơn</h3>
                                <p className="text-sm text-foreground-secondary font-mono">{selectedInvoice.invoiceNumber}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`/invoices/${selectedInvoice.id}/print`)}
                                    className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                                    title="In hóa đơn"
                                >
                                    <Printer className="w-4 h-4" />
                                    In
                                </button>
                                <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-background-hover rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4">
                            {/* Customer Info */}
                            <div className="bg-background-tertiary rounded-xl p-4">
                                <h4 className="font-medium text-foreground mb-3">Thông tin khách hàng</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-foreground-secondary">Họ tên:</span>
                                        <span className="ml-2 text-foreground">{selectedInvoice.customer?.name || 'Khách lẻ'}</span>
                                    </div>
                                    {selectedInvoice.customer?.phone && (
                                        <div>
                                            <span className="text-foreground-secondary">Số điện thoại:</span>
                                            <span className="ml-2 text-foreground">{selectedInvoice.customer.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="font-medium text-foreground mb-3">Chi tiết đơn hàng</h4>
                                <div className="bg-background-tertiary rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-border">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-foreground-secondary">Mô tả</th>
                                                <th className="text-center px-4 py-3 text-foreground-secondary">SL</th>
                                                <th className="text-right px-4 py-3 text-foreground-secondary">Đơn giá</th>
                                                <th className="text-right px-4 py-3 text-foreground-secondary">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice.items.map((item) => (
                                                <tr key={item.id} className="border-b border-border/50">
                                                    <td className="px-4 py-3 text-foreground">{item.description}</td>
                                                    <td className="px-4 py-3 text-center text-foreground">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-foreground-secondary">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="px-4 py-3 text-right text-foreground font-medium">{formatCurrency(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-background-tertiary rounded-xl p-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-foreground-secondary">Tạm tính:</span>
                                        <span className="text-foreground">{formatCurrency(selectedInvoice.subtotal)}</span>
                                    </div>
                                    {selectedInvoice.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-foreground-secondary">Giảm giá:</span>
                                            <span className="text-red-400">-{formatCurrency(selectedInvoice.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                                        <span className="text-foreground">Tổng cộng:</span>
                                        <span className="text-primary-500">{formatCurrency(selectedInvoice.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedInvoice.notes && (
                                <div className="bg-background-tertiary rounded-xl p-4">
                                    <h4 className="font-medium text-foreground mb-2">Ghi chú</h4>
                                    <p className="text-sm text-foreground-secondary">{selectedInvoice.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {selectedInvoice.paymentStatus === 'PENDING' && (
                            <div className="flex gap-3 p-4 border-t border-border">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => cancelMutation.mutate(selectedInvoice.id)}
                                >
                                    Hủy hóa đơn
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => payMutation.mutate(selectedInvoice.id)}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
