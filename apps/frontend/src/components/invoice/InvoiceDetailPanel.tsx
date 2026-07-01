import {
    X,
    Clock,
    User,
    Phone,
    CreditCard,
    FileText,
    Printer,
    CheckCircle,
    XCircle,
    DollarSign,
    Receipt,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';

interface InvoiceItem {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    status: 'PAID' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
    customer?: {
        id: string;
        name: string;
        phone: string;
    };
    court?: {
        id: string;
        name: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod?: string;
    notes?: string;
    bookingId?: string;
    createdAt: string;
}

interface InvoiceDetailPanelProps {
    invoice: Invoice | null;
    isOpen: boolean;
    onClose: () => void;
    onPrint?: (id: string) => void;
    onMarkPaid?: (id: string) => void;
    onRefund?: (id: string) => void;
}

const STATUS_CONFIG = {
    PAID: { label: 'Đã thanh toán', color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
    PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-500/20 text-yellow-500', icon: Clock },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-500', icon: XCircle },
    REFUNDED: { label: 'Hoàn tiền', color: 'bg-purple-500/20 text-purple-500', icon: DollarSign },
};

const PAYMENT_METHODS: Record<string, string> = {
    CASH: 'Tiền mặt',
    BANK_TRANSFER: 'Chuyển khoản',
    MOMO: 'Ví MoMo',
    CARD: 'Thẻ tín dụng',
};

function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function InvoiceDetailPanel({
    invoice,
    isOpen,
    onClose,
    onPrint,
    onMarkPaid,
    onRefund,
}: InvoiceDetailPanelProps) {
    if (!isOpen || !invoice) return null;

    const statusConfig = STATUS_CONFIG[invoice.status];
    const StatusIcon = statusConfig.icon;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={cn(
                'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background-secondary border-l border-border shadow-2xl',
                'transform transition-transform duration-300 ease-out',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">{invoice.invoiceNumber}</h2>
                            <p className="text-sm text-foreground-secondary">
                                {formatDateTime(invoice.createdAt)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background-hover rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                            statusConfig.color
                        )}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                        </span>
                    </div>

                    {/* Customer Info */}
                    {invoice.customer && (
                        <div className="p-4 bg-background-tertiary rounded-xl">
                            <h3 className="text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Khách hàng
                            </h3>
                            <p className="font-medium text-foreground">{invoice.customer.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-foreground-secondary">
                                <Phone className="w-3 h-3" />
                                <span>{invoice.customer.phone}</span>
                            </div>
                        </div>
                    )}

                    {/* Court Info */}
                    {invoice.court && (
                        <div className="p-4 bg-background-tertiary rounded-xl">
                            <h3 className="text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Sân
                            </h3>
                            <p className="font-medium text-foreground">{invoice.court.name}</p>
                        </div>
                    )}

                    {/* Items */}
                    <div className="p-4 bg-background-tertiary rounded-xl">
                        <h3 className="text-sm font-medium text-foreground-secondary mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Chi tiết đơn hàng
                        </h3>
                        <div className="space-y-3">
                            {invoice.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-foreground">{item.name}</p>
                                        <p className="text-sm text-foreground-secondary">
                                            {item.quantity} x {formatCurrency(item.unitPrice)}
                                        </p>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatCurrency(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 pt-4 border-t border-border space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-foreground-secondary">Tạm tính</span>
                                <span className="text-foreground">{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-foreground-secondary">Giảm giá</span>
                                    <span className="text-green-500">-{formatCurrency(invoice.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-foreground">Tổng cộng</span>
                                <span className="text-primary-500">{formatCurrency(invoice.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    {invoice.paymentMethod && (
                        <div className="p-4 bg-background-tertiary rounded-xl">
                            <h3 className="text-sm font-medium text-foreground-secondary mb-2 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Phương thức thanh toán
                            </h3>
                            <p className="font-medium text-foreground">
                                {PAYMENT_METHODS[invoice.paymentMethod] || invoice.paymentMethod}
                            </p>
                        </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="p-4 bg-background-tertiary rounded-xl">
                            <h3 className="text-sm font-medium text-foreground-secondary mb-2">Ghi chú</h3>
                            <p className="text-foreground">{invoice.notes}</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background-secondary">
                    <div className="flex gap-2">
                        {invoice.status === 'PENDING' && onMarkPaid && (
                            <Button
                                className="flex-1 gap-2"
                                onClick={() => onMarkPaid(invoice.id)}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Xác nhận thanh toán
                            </Button>
                        )}
                        {invoice.status === 'PAID' && onRefund && (
                            <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => onRefund(invoice.id)}
                            >
                                <DollarSign className="w-4 h-4" />
                                Hoàn tiền
                            </Button>
                        )}
                        {onPrint && (
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => onPrint(invoice.id)}
                            >
                                <Printer className="w-4 h-4" />
                                In hóa đơn
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
