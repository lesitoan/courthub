import { AlertTriangle, Package, TrendingDown, Bell, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InventoryItem {
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    unit: string;
    category: string;
}

interface InventoryAlertProps {
    lowStockItems: InventoryItem[];
    onDismiss?: (itemId: string) => void;
    onViewAll?: () => void;
    onRestock?: (itemId: string) => void;
}

export function InventoryAlert({ lowStockItems, onDismiss, onViewAll, onRestock }: InventoryAlertProps) {
    if (lowStockItems.length === 0) {
        return null;
    }

    const criticalItems = lowStockItems.filter(item => item.currentStock === 0);
    const warningItems = lowStockItems.filter(item => item.currentStock > 0);

    return (
        <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-orange-500/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            Cảnh báo tồn kho
                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {lowStockItems.length}
                            </span>
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                            {criticalItems.length > 0 && (
                                <span className="text-red-500">{criticalItems.length} hết hàng, </span>
                            )}
                            {warningItems.length} sắp hết
                        </p>
                    </div>
                </div>
                {onViewAll && (
                    <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
                        Xem tất cả
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Items List */}
            <div className="divide-y divide-border max-h-72 overflow-auto">
                {/* Critical Items First */}
                {criticalItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-red-500 font-semibold">Hết hàng</span>
                                    <span className="text-foreground-muted">•</span>
                                    <span className="text-foreground-secondary">{item.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {onRestock && (
                                <Button size="sm" onClick={() => onRestock(item.id)}>
                                    Nhập hàng
                                </Button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={() => onDismiss(item.id)}
                                    className="p-1 hover:bg-background-hover rounded"
                                >
                                    <X className="w-4 h-4 text-foreground-muted" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Warning Items */}
                {warningItems.map((item) => {
                    const stockPercent = (item.currentStock / item.minStock) * 100;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 hover:bg-background-hover transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">{item.name}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={cn(
                                            'font-semibold',
                                            stockPercent < 50 ? 'text-orange-500' : 'text-yellow-500'
                                        )}>
                                            Còn {item.currentStock} {item.unit}
                                        </span>
                                        <span className="text-foreground-muted">•</span>
                                        <span className="text-foreground-secondary">
                                            Tối thiểu: {item.minStock}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Bar */}
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-2 bg-background-tertiary rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            stockPercent < 50 ? 'bg-orange-500' : 'bg-yellow-500'
                                        )}
                                        style={{ width: `${Math.min(stockPercent, 100)}%` }}
                                    />
                                </div>
                                {onDismiss && (
                                    <button
                                        onClick={() => onDismiss(item.id)}
                                        className="p-1 hover:bg-background-hover rounded"
                                    >
                                        <X className="w-4 h-4 text-foreground-muted" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Compact version for sidebar/dashboard
export function InventoryAlertBadge({ count, onClick }: { count: number; onClick?: () => void }) {
    if (count === 0) return null;

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors"
        >
            <Package className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">
                {count} sản phẩm sắp hết
            </span>
        </button>
    );
}
