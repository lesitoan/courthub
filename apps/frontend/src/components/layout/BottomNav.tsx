import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_ROUTES } from '@/lib/routes';

const navItems = [
    { name: 'Trang chủ', href: ADMIN_ROUTES.dashboard, icon: LayoutDashboard },
    { name: 'Lịch', href: ADMIN_ROUTES.calendar, icon: Calendar },
    { name: 'Khách', href: ADMIN_ROUTES.customers, icon: Users },
    { name: 'Hóa đơn', href: ADMIN_ROUTES.invoices, icon: FileText },
    { name: 'Thêm', href: '#', icon: Menu },
];

export function BottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary border-t border-border safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors',
                                isActive
                                    ? 'text-primary-500'
                                    : 'text-foreground-muted hover:text-foreground'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs mt-1 font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

