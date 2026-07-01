import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Calendar,
    Users,
    Grid3X3,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Search,
    ChevronDown,
    Package,
    Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NotificationDropdown } from './NotificationDropdown'
import { BottomNav } from './BottomNav'

interface AppLayoutProps {
    children: React.ReactNode
}

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Lịch đặt sân', href: '/calendar', icon: Calendar },
    { name: 'Khách hàng', href: '/customers', icon: Users },
    { name: 'Quản lý sân', href: '/courts', icon: Grid3X3 },
    { name: 'Quản lý cơ sở', href: '/venues', icon: Building2 },
    { name: 'Hóa đơn', href: '/invoices', icon: FileText },
    { name: 'Kho & Dịch vụ', href: '/inventory', icon: Package },
    { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
]

export function AppLayout({ children }: AppLayoutProps) {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - hidden on mobile */}
            <aside className="hidden md:flex w-64 bg-background-secondary border-r border-border flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-xl font-bold text-primary-500">Courtify</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-500/10 text-primary-500'
                                        : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Settings & Logout */}
                <div className="p-3 border-t border-border space-y-1">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary-500/10 text-primary-500'
                                    : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                            )
                        }
                    >
                        <Settings className="w-5 h-5" />
                        Cài đặt
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-secondary hover:text-error hover:bg-error/10 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-background-secondary border-b border-border flex items-center justify-between px-4 md:px-6">
                    {/* Mobile logo */}
                    <div className="md:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                    </div>

                    {/* Search - hidden on mobile */}
                    <div className="hidden md:block w-80">
                        <Input
                            placeholder="Tìm kiếm..."
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Venue selector - hidden on mobile */}
                        <Button variant="secondary" size="sm" className="hidden sm:flex gap-2">
                            <span className="hidden lg:inline">Courtify Phú Nhuận</span>
                            <span className="lg:hidden">Cơ sở</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* User menu */}
                        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border">
                            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                                <span className="text-primary-500 font-medium text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                <p className="text-xs text-foreground-muted">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content - add bottom padding for mobile nav */}
                <main className="flex-1 overflow-auto bg-background pb-16 md:pb-0 p-4 md:p-6">
                    {children}
                </main>
            </div>

            {/* Mobile bottom navigation */}
            <BottomNav />
        </div>
    )
}
