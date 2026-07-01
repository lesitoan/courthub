import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketMessage<T = unknown> {
    type: string;
    payload: T;
    timestamp: number;
}

interface UseWebSocketOptions {
    url: string;
    autoConnect?: boolean;
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
}

interface UseWebSocketReturn<T> {
    status: WebSocketStatus;
    lastMessage: WebSocketMessage<T> | null;
    sendMessage: (type: string, payload: unknown) => void;
    connect: () => void;
    disconnect: () => void;
    reconnectAttempts: number;
}

export function useWebSocket<T = unknown>(
    options: UseWebSocketOptions
): UseWebSocketReturn<T> {
    const {
        url,
        autoConnect = true,
        reconnect = true,
        reconnectInterval = 3000,
        maxReconnectAttempts = 10,
        onOpen,
        onClose,
        onError,
    } = options;

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const [status, setStatus] = useState<WebSocketStatus>('disconnected');
    const [lastMessage, setLastMessage] = useState<WebSocketMessage<T> | null>(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setStatus('connecting');

        try {
            wsRef.current = new WebSocket(url);

            wsRef.current.onopen = () => {
                setStatus('connected');
                setReconnectAttempts(0);
                onOpen?.();
            };

            wsRef.current.onclose = () => {
                setStatus('disconnected');
                onClose?.();

                // Attempt reconnection
                if (reconnect && reconnectAttempts < maxReconnectAttempts) {
                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        setReconnectAttempts(prev => prev + 1);
                        connect();
                    }, reconnectInterval);
                }
            };

            wsRef.current.onerror = (event) => {
                setStatus('error');
                onError?.(event);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage<T>;
                    setLastMessage(message);
                } catch {
                    console.error('Failed to parse WebSocket message:', event.data);
                }
            };
        } catch (error) {
            setStatus('error');
            console.error('WebSocket connection error:', error);
        }
    }, [url, reconnect, reconnectInterval, maxReconnectAttempts, reconnectAttempts, onOpen, onClose, onError]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setStatus('disconnected');
    }, []);

    const sendMessage = useCallback((type: string, payload: unknown) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage = {
                type,
                payload,
                timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        status,
        lastMessage,
        sendMessage,
        connect,
        disconnect,
        reconnectAttempts,
    };
}

// Specialized hooks for different real-time features

// Booking updates
interface BookingUpdate {
    bookingId: string;
    action: 'created' | 'updated' | 'cancelled' | 'checked_in' | 'checked_out';
    booking: unknown;
}

export function useBookingUpdates(venueId: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/bookings?venue=${venueId}`;

    return useWebSocket<BookingUpdate>({
        url: wsUrl,
        autoConnect: true,
        reconnect: true,
    });
}

// Court status updates
interface CourtStatusUpdate {
    courtId: string;
    status: 'available' | 'occupied' | 'maintenance';
    currentBooking?: {
        customerId: string;
        customerName: string;
        remainingMinutes: number;
    };
}

export function useCourtStatusUpdates(venueId: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/courts?venue=${venueId}`;

    return useWebSocket<CourtStatusUpdate>({
        url: wsUrl,
        autoConnect: true,
        reconnect: true,
    });
}

// Dashboard stats updates
interface DashboardUpdate {
    type: 'stats' | 'revenue' | 'booking_count';
    data: {
        todayRevenue?: number;
        todayBookings?: number;
        activeBookings?: number;
        courtUsage?: number;
    };
}

export function useDashboardUpdates(venueId: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/dashboard?venue=${venueId}`;

    return useWebSocket<DashboardUpdate>({
        url: wsUrl,
        autoConnect: true,
        reconnect: true,
    });
}

// Notification updates
interface NotificationUpdate {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
}

export function useNotificationUpdates(userId: string) {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/notifications?user=${userId}`;

    return useWebSocket<NotificationUpdate>({
        url: wsUrl,
        autoConnect: true,
        reconnect: true,
    });
}

// Connection status indicator component
export function WebSocketStatusIndicator({ status }: { status: WebSocketStatus }) {
    const statusConfig = {
        connecting: { color: 'bg-yellow-500', label: 'Đang kết nối...' },
        connected: { color: 'bg-green-500', label: 'Đã kết nối' },
        disconnected: { color: 'bg-gray-500', label: 'Mất kết nối' },
        error: { color: 'bg-red-500', label: 'Lỗi kết nối' },
    };

    const config = statusConfig[status];

    return (
        <div className= "flex items-center gap-2 text-xs" >
        <span className={ `w-2 h-2 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}` } />
            < span className = "text-foreground-muted" > { config.label } </span>
                </div>
    );
}
