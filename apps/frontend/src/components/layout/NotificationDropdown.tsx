import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Clock, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
    // Link để navigate khi click
    link?: string;
    // Data bổ sung (bookingId, invoiceId, etc.)
    data?: {
        bookingId?: string;
        invoiceId?: string;
        customerId?: string;
        courtId?: string;
    };
}

// Mock notifications - in real app, this would come from API
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'info',
        title: 'Đặt sân mới',
        message: 'Nguyễn Văn A đã đặt Sân A1 lúc 18:00',
        time: '5 phút trước',
        read: false,
        link: '/calendar',
        data: { bookingId: 'booking-001' },
    },
    {
        id: '2',
        type: 'warning',
        title: 'Sắp check-in',
        message: 'Trần Thị B có lịch lúc 14:00 - Sân A2',
        time: '15 phút trước',
        read: false,
        link: '/calendar',
        data: { bookingId: 'booking-002' },
    },
    {
        id: '3',
        type: 'success',
        title: 'Thanh toán thành công',
        message: 'Hóa đơn #INV-2026-001234 đã được thanh toán',
        time: '1 giờ trước',
        read: true,
        link: '/invoices',
        data: { invoiceId: 'INV-2026-001234' },
    },
    {
        id: '4',
        type: 'error',
        title: 'Hủy đặt sân',
        message: 'Lê Văn C đã hủy lịch đặt lúc 20:00',
        time: '2 giờ trước',
        read: true,
        link: '/calendar',
        data: { bookingId: 'booking-003' },
    },
    {
        id: '5',
        type: 'warning',
        title: 'Tồn kho thấp',
        message: 'Cầu lông Yonex AS-50 còn 5 sản phẩm',
        time: '3 giờ trước',
        read: false,
        link: '/inventory',
    },
];

export function NotificationDropdown() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        // Close dropdown
        setIsOpen(false);

        // Navigate to the relevant page
        if (notification.link) {
            // Build query params if needed
            const params = new URLSearchParams();
            if (notification.data?.bookingId) {
                params.set('booking', notification.data.bookingId);
            }
            if (notification.data?.invoiceId) {
                params.set('invoice', notification.data.invoiceId);
            }
            if (notification.data?.customerId) {
                params.set('customer', notification.data.customerId);
            }

            const queryString = params.toString();
            const url = queryString ? `${notification.link}?${queryString}` : notification.link;
            navigate(url);
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'info': return <Bell className="w-4 h-4 text-info" />;
            case 'warning': return <Clock className="w-4 h-4 text-warning" />;
            case 'success': return <Check className="w-4 h-4 text-success" />;
            case 'error': return <X className="w-4 h-4 text-error" />;
        }
    };

    const getTypeBgColor = (type: Notification['type']) => {
        switch (type) {
            case 'info': return 'bg-info/10';
            case 'warning': return 'bg-warning/10';
            case 'success': return 'bg-success/10';
            case 'error': return 'bg-error/10';
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-tertiary transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-background-secondary border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-tertiary/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">Thông báo</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary-500 hover:underline font-medium"
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    {/* Notifications list */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-foreground-muted">
                                <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">Không có thông báo mới</p>
                                <p className="text-sm mt-1">Khi có thông báo, chúng sẽ hiển thị ở đây</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        'w-full text-left px-4 py-3.5 hover:bg-background-tertiary transition-colors border-b border-border last:border-0 group',
                                        !notification.read && 'bg-primary-500/5'
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn('mt-0.5 p-2 rounded-lg', getTypeBgColor(notification.type))}>
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={cn(
                                                    'font-medium text-sm',
                                                    !notification.read ? 'text-foreground' : 'text-foreground-secondary'
                                                )}>
                                                    {notification.title}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-xs text-foreground-secondary mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-xs text-foreground-muted">
                                                    {notification.time}
                                                </span>
                                                {!notification.read && (
                                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border bg-background-tertiary/50">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/notifications');
                            }}
                            className="w-full py-3 text-sm text-primary-500 hover:bg-background-tertiary transition-colors font-medium flex items-center justify-center gap-1"
                        >
                            Xem tất cả thông báo
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
