import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    X,
    Calendar,
    Users,
    Receipt,
    Package,
    Settings,
    FileText,
    BarChart3,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    type: 'page' | 'action' | 'customer' | 'booking';
    title: string;
    description?: string;
    icon: typeof Search;
    path?: string;
    action?: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (query: string) => SearchResult[];
}

// Default navigation items
const DEFAULT_ITEMS: SearchResult[] = [
    { id: 'home', type: 'page', title: 'Trang chủ', icon: Home, path: '/' },
    { id: 'calendar', type: 'page', title: 'Lịch đặt sân', icon: Calendar, path: '/calendar' },
    { id: 'customers', type: 'page', title: 'Khách hàng', icon: Users, path: '/customers' },
    { id: 'invoices', type: 'page', title: 'Hóa đơn', icon: Receipt, path: '/invoices' },
    { id: 'inventory', type: 'page', title: 'Kho hàng', icon: Package, path: '/inventory' },
    { id: 'reports', type: 'page', title: 'Báo cáo', icon: BarChart3, path: '/reports' },
    { id: 'courts', type: 'page', title: 'Quản lý sân', icon: FileText, path: '/courts' },
    { id: 'settings', type: 'page', title: 'Cài đặt', icon: Settings, path: '/settings' },
];

export function CommandPalette({ isOpen, onClose, onSearch }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    // Filter results based on query
    const results = query.trim()
        ? onSearch
            ? onSearch(query)
            : DEFAULT_ITEMS.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            )
        : DEFAULT_ITEMS;

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                const selected = results[selectedIndex];
                if (selected) {
                    handleSelect(selected);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, results, selectedIndex, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Clear query when closing
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = (item: SearchResult) => {
        if (item.action) {
            item.action();
        } else if (item.path) {
            navigate(item.path);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-lg animate-scaleIn">
                <div className="bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <Search className="w-5 h-5 text-foreground-muted shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm kiếm trang, khách hàng, đặt sân..."
                            className="flex-1 bg-transparent text-foreground placeholder:text-foreground-muted focus:outline-none"
                            autoFocus
                        />
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-background-hover rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-foreground-muted" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-auto p-2">
                        {results.length === 0 ? (
                            <div className="py-8 text-center text-foreground-secondary">
                                <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Không tìm thấy kết quả</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {results.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                                index === selectedIndex
                                                    ? 'bg-primary-500 text-white'
                                                    : 'hover:bg-background-hover'
                                            )}
                                        >
                                            <Icon className={cn(
                                                'w-5 h-5 shrink-0',
                                                index === selectedIndex ? 'text-white' : 'text-foreground-muted'
                                            )} />
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    'font-medium truncate',
                                                    index === selectedIndex ? 'text-white' : 'text-foreground'
                                                )}>
                                                    {item.title}
                                                </p>
                                                {item.description && (
                                                    <p className={cn(
                                                        'text-sm truncate',
                                                        index === selectedIndex ? 'text-white/70' : 'text-foreground-secondary'
                                                    )}>
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={cn(
                                                'text-xs px-2 py-0.5 rounded',
                                                index === selectedIndex
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-background-tertiary text-foreground-muted'
                                            )}>
                                                {item.type === 'page' ? 'Trang' : item.type === 'action' ? 'Hành động' : 'Dữ liệu'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-foreground-muted">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background-tertiary rounded">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-background-tertiary rounded">↓</kbd>
                                Di chuyển
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background-tertiary rounded">Enter</kbd>
                                Chọn
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-background-tertiary rounded">Esc</kbd>
                            Đóng
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Hook to handle Ctrl+K shortcut
export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(prev => !prev),
    };
}
