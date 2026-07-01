import { useState } from 'react';
import { Plus, X, Calendar, Users, Package, Receipt, Settings, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
    id: string;
    label: string;
    icon: typeof Plus;
    color: string;
    path?: string;
    onClick?: () => void;
}

interface QuickActionsButtonProps {
    onNewBooking?: () => void;
    onNewCustomer?: () => void;
    onNewInvoice?: () => void;
    onRecurringBooking?: () => void;
}

export function QuickActionsButton({
    onNewBooking,
    onNewCustomer,
    onNewInvoice,
    onRecurringBooking,
}: QuickActionsButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const actions: QuickAction[] = [
        {
            id: 'booking',
            label: 'Đặt sân mới',
            icon: Calendar,
            color: 'bg-green-500 hover:bg-green-600',
            onClick: onNewBooking,
            path: '/calendar',
        },
        {
            id: 'recurring',
            label: 'Lịch cố định',
            icon: Repeat,
            color: 'bg-blue-500 hover:bg-blue-600',
            onClick: onRecurringBooking,
        },
        {
            id: 'customer',
            label: 'Thêm khách',
            icon: Users,
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: onNewCustomer,
            path: '/customers',
        },
        {
            id: 'invoice',
            label: 'Tạo hóa đơn',
            icon: Receipt,
            color: 'bg-orange-500 hover:bg-orange-600',
            onClick: onNewInvoice,
            path: '/invoices',
        },
        {
            id: 'inventory',
            label: 'Nhập kho',
            icon: Package,
            color: 'bg-cyan-500 hover:bg-cyan-600',
            path: '/inventory',
        },
        {
            id: 'settings',
            label: 'Cài đặt',
            icon: Settings,
            color: 'bg-gray-500 hover:bg-gray-600',
            path: '/settings',
        },
    ];

    const handleAction = (action: QuickAction) => {
        if (action.onClick) {
            action.onClick();
        } else if (action.path) {
            navigate(action.path);
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Actions Menu */}
            <div className={cn(
                'fixed bottom-24 right-4 z-50 flex flex-col-reverse items-end gap-3 transition-all duration-300',
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}>
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action)}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg transition-all',
                                action.color,
                                'animate-fadeIn'
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium whitespace-nowrap">{action.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 lg:hidden',
                    isOpen
                        ? 'bg-red-500 hover:bg-red-600 rotate-45'
                        : 'bg-primary-500 hover:bg-primary-600 rotate-0'
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Plus className="w-6 h-6 text-white" />
                )}
            </button>
        </>
    );
}

// Desktop version - inline quick actions bar
export function QuickActionsBar({
    onNewBooking,
    onNewCustomer,
    onNewInvoice,
}: QuickActionsButtonProps) {
    const navigate = useNavigate();

    const primaryActions = [
        {
            id: 'booking',
            label: 'Đặt sân',
            icon: Calendar,
            color: 'bg-green-500 hover:bg-green-600',
            onClick: onNewBooking || (() => navigate('/calendar')),
        },
        {
            id: 'customer',
            label: 'Thêm khách',
            icon: Users,
            color: 'bg-purple-500 hover:bg-purple-600',
            onClick: onNewCustomer || (() => navigate('/customers')),
        },
        {
            id: 'invoice',
            label: 'Hóa đơn',
            icon: Receipt,
            color: 'bg-orange-500 hover:bg-orange-600',
            onClick: onNewInvoice || (() => navigate('/invoices')),
        },
    ];

    return (
        <div className="hidden lg:flex items-center gap-2">
            {primaryActions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all',
                            action.color
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {action.label}
                    </button>
                );
            })}
        </div>
    );
}
