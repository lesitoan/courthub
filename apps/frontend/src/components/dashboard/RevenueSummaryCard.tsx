import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Building2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface PaymentBreakdown {
    cash: number;
    bankTransfer: number;
    momo: number;
    card: number;
}

interface RevenueSummaryProps {
    totalRevenue: number;
    previousRevenue?: number;
    period?: 'day' | 'week' | 'month';
    paymentBreakdown?: PaymentBreakdown;
    pendingAmount?: number;
    refundedAmount?: number;
}

const PERIOD_LABELS: Record<string, string> = {
    day: 'hôm nay',
    week: 'tuần này',
    month: 'tháng này',
};

const PAYMENT_METHODS = [
    { key: 'cash', label: 'Tiền mặt', icon: Wallet, color: 'text-green-500 bg-green-500/10' },
    { key: 'bankTransfer', label: 'Chuyển khoản', icon: Building2, color: 'text-blue-500 bg-blue-500/10' },
    { key: 'momo', label: 'MoMo', icon: CreditCard, color: 'text-pink-500 bg-pink-500/10' },
    { key: 'card', label: 'Thẻ', icon: CreditCard, color: 'text-purple-500 bg-purple-500/10' },
];

function getChangePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

export function RevenueSummaryCard({
    totalRevenue,
    previousRevenue,
    period = 'day',
    paymentBreakdown,
    pendingAmount = 0,
    refundedAmount = 0,
}: RevenueSummaryProps) {
    const change = previousRevenue !== undefined ? getChangePercent(totalRevenue, previousRevenue) : undefined;
    const isPositive = change !== undefined && change >= 0;

    return (
        <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                            <p className="text-sm text-foreground-secondary">Doanh thu {PERIOD_LABELS[period]}</p>
                            <h3 className="text-3xl font-bold text-foreground">
                                {formatCurrency(totalRevenue)}
                            </h3>
                        </div>
                    </div>

                    {/* Change Indicator */}
                    {change !== undefined && (
                        <div className={cn(
                            'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium',
                            isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        )}>
                            {isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            {isPositive ? '+' : ''}{change.toFixed(1)}%
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-tertiary/50 backdrop-blur rounded-lg p-3">
                        <p className="text-xs text-foreground-muted">Chờ thanh toán</p>
                        <p className="text-lg font-semibold text-yellow-500">{formatCurrency(pendingAmount)}</p>
                    </div>
                    <div className="bg-background-tertiary/50 backdrop-blur rounded-lg p-3">
                        <p className="text-xs text-foreground-muted">Hoàn tiền</p>
                        <p className="text-lg font-semibold text-red-500">{formatCurrency(refundedAmount)}</p>
                    </div>
                </div>
            </div>

            {/* Payment Breakdown */}
            {paymentBreakdown && (
                <div className="p-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground-secondary mb-3">Phương thức thanh toán</h4>
                    <div className="space-y-3">
                        {PAYMENT_METHODS.map((method) => {
                            const amount = paymentBreakdown[method.key as keyof PaymentBreakdown] || 0;
                            const percent = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                            const Icon = method.icon;

                            return (
                                <div key={method.key}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={cn('w-6 h-6 rounded flex items-center justify-center', method.color)}>
                                                <Icon className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm text-foreground">{method.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-foreground">{formatCurrency(amount)}</span>
                                            <span className="text-xs text-foreground-muted ml-2">({percent.toFixed(0)}%)</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all', method.color.replace('text-', 'bg-').replace('/10', ''))}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
