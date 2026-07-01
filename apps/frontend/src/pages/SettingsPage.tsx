import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Settings,
    Building2,
    Clock,
    DollarSign,
    Bell,
    Shield,
    Save,
    Plus,
    Trash2,
    Edit2,
    X,
    MapPin,
    Phone,
    Mail,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { venueApi, Venue } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';

interface TabProps {
    active: boolean;
    icon: React.ElementType;
    label: string;
    onClick: () => void;
}

function Tab({ active, icon: Icon, label, onClick }: TabProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors w-full text-left rounded-lg',
                active
                    ? 'bg-primary-500/20 text-primary-500'
                    : 'text-foreground-secondary hover:bg-background-hover hover:text-foreground'
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

// Venue Form Modal
interface VenueFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    venue?: Venue | null;
    onSave: (data: Partial<Venue>) => Promise<void>;
}

function VenueFormModal({ isOpen, onClose, venue, onSave }: VenueFormModalProps) {
    const [formData, setFormData] = useState({
        name: venue?.name || '',
        address: venue?.address || '',
        phone: venue?.phone || '',
        email: venue?.email || '',
        openTime: venue?.openTime || '06:00',
        closeTime: venue?.closeTime || '23:00',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg animate-scaleIn">
                <div className="bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="font-semibold text-foreground">
                            {venue ? 'Sửa thông tin cơ sở' : 'Thêm cơ sở mới'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-lg">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Tên cơ sở *
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Sân cầu lông ABC"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Địa chỉ *
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="123 Đường XYZ, Quận 1, TP.HCM"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Số điện thoại
                                </label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="0912 345 678"
                                    type="tel"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Email
                                </label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="info@example.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Giờ mở cửa
                                </label>
                                <Input
                                    type="time"
                                    value={formData.openTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, openTime: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Giờ đóng cửa
                                </label>
                                <Input
                                    type="time"
                                    value={formData.closeTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, closeTime: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border">
                            <Button variant="ghost" type="button" className="flex-1" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button type="submit" className="flex-1 gap-2" disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {venue ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('venue');
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch venues
    const { data: venuesData, isLoading: loadingVenues } = useQuery({
        queryKey: ['venues'],
        queryFn: () => venueApi.getAll({ isActive: true }),
    });

    const venues = venuesData?.data || [];

    // Create/Update venue mutation
    const saveMutation = useMutation({
        mutationFn: async (data: Partial<Venue>) => {
            if (editingVenue) {
                return venueApi.update(editingVenue.id, data);
            } else {
                return venueApi.create(data as any);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            toast({
                title: 'Thành công',
                description: editingVenue ? 'Đã cập nhật thông tin cơ sở' : 'Đã thêm cơ sở mới',
                variant: 'success',
            });
            setEditingVenue(null);
        },
        onError: () => {
            toast({
                title: 'Lỗi',
                description: 'Không thể lưu thông tin. Vui lòng thử lại.',
                variant: 'error',
            });
        },
    });

    // Delete venue mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => venueApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            toast({
                title: 'Đã xóa',
                description: 'Đã xóa cơ sở thành công',
                variant: 'success',
            });
        },
    });

    const handleAddVenue = () => {
        setEditingVenue(null);
        setIsVenueModalOpen(true);
    };

    const handleEditVenue = (venue: Venue) => {
        setEditingVenue(venue);
        setIsVenueModalOpen(true);
    };

    const handleDeleteVenue = (venue: Venue) => {
        if (confirm(`Bạn có chắc muốn xóa "${venue.name}"?`)) {
            deleteMutation.mutate(venue.id);
        }
    };

    const handleSaveVenue = async (data: Partial<Venue>) => {
        await saveMutation.mutateAsync(data);
    };

    const tabs = [
        { id: 'venue', icon: Building2, label: 'Thông tin cơ sở' },
        { id: 'hours', icon: Clock, label: 'Giờ hoạt động' },
        { id: 'pricing', icon: DollarSign, label: 'Bảng giá' },
        { id: 'notifications', icon: Bell, label: 'Thông báo' },
        { id: 'security', icon: Shield, label: 'Bảo mật' },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="bg-background-secondary border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                            <Settings className="w-5 h-5 text-primary-500" />
                            <h2 className="font-semibold text-foreground">Cài đặt</h2>
                        </div>
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.id}
                                    active={activeTab === tab.id}
                                    icon={tab.icon}
                                    label={tab.label}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Venue Settings */}
                    {activeTab === 'venue' && (
                        <div className="bg-background-secondary border border-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Thông tin cơ sở</h3>
                                    <p className="text-sm text-foreground-secondary">Quản lý các cơ sở sân cầu lông</p>
                                </div>
                                <Button onClick={handleAddVenue} className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Thêm cơ sở
                                </Button>
                            </div>

                            {loadingVenues ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                                </div>
                            ) : venues.length === 0 ? (
                                <div className="text-center py-12">
                                    <Building2 className="w-12 h-12 mx-auto mb-4 text-foreground-muted opacity-50" />
                                    <p className="text-foreground-secondary mb-4">Chưa có cơ sở nào</p>
                                    <Button onClick={handleAddVenue} variant="outline" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Thêm cơ sở đầu tiên
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {venues.map((venue: Venue) => (
                                        <div key={venue.id} className="border border-border rounded-xl p-5 hover:border-primary-500/30 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-foreground text-lg">{venue.name}</h4>
                                                    <div className="flex items-center gap-1 text-sm text-foreground-secondary mt-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {venue.address}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditVenue(venue)}
                                                        className="gap-1.5"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        onClick={() => handleDeleteVenue(venue)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-foreground-muted" />
                                                    <span className="text-foreground">{venue.phone || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-foreground-muted" />
                                                    <span className="text-foreground">{venue.email || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-foreground-muted" />
                                                    <span className="text-foreground">{venue.openTime} - {venue.closeTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Operating Hours */}
                    {activeTab === 'hours' && (
                        <div className="bg-background-secondary border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-6">Giờ hoạt động</h3>
                            <div className="space-y-4">
                                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day, i) => (
                                    <div key={i} className="flex flex-wrap items-center gap-4 p-3 bg-background-tertiary/50 rounded-lg">
                                        <span className="w-24 font-medium text-foreground">{day}</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                defaultValue="06:00"
                                                className="bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                                            />
                                            <span className="text-foreground-secondary">đến</span>
                                            <input
                                                type="time"
                                                defaultValue="23:00"
                                                className="bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm text-foreground-secondary ml-auto">
                                            <input type="checkbox" defaultChecked className="rounded accent-primary-500" />
                                            Hoạt động
                                        </label>
                                    </div>
                                ))}
                                <Button className="mt-4 gap-2">
                                    <Save className="w-4 h-4" />
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Pricing */}
                    {activeTab === 'pricing' && (
                        <div className="bg-background-secondary border border-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Bảng giá</h3>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Thêm khung giá
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: 'Giá mặc định', time: 'Tất cả khung giờ', price: 150000 },
                                    { name: 'Giờ cao điểm tối', time: '17:00 - 21:00', price: 200000 },
                                    { name: 'Cuối tuần', time: 'Thứ 7 - Chủ Nhật', price: 180000 },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                                        <div>
                                            <h4 className="font-medium text-foreground">{rule.name}</h4>
                                            <p className="text-sm text-foreground-secondary">{rule.time}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-primary-500">{formatCurrency(rule.price)}/giờ</span>
                                            <Button variant="ghost" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="bg-background-secondary border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-6">Thông báo</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Thông báo khi có đặt sân mới', enabled: true },
                                    { label: 'Thông báo khi khách hủy sân', enabled: true },
                                    { label: 'Nhắc nhở trước giờ đặt sân', enabled: false },
                                    { label: 'Báo cáo doanh thu hàng ngày', enabled: true },
                                    { label: 'Email marketing cho khách hàng', enabled: false },
                                ].map((setting, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                                        <span className="text-foreground">{setting.label}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-background-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <div className="bg-background-secondary border border-border rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-6">Bảo mật</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-foreground mb-4">Đổi mật khẩu</h4>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm text-foreground-secondary mb-1">Mật khẩu hiện tại</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-foreground-secondary mb-1">Mật khẩu mới</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-foreground-secondary mb-1">Xác nhận mật khẩu mới</label>
                                            <Input type="password" placeholder="••••••••" />
                                        </div>
                                        <Button className="gap-2">
                                            <Save className="w-4 h-4" />
                                            Cập nhật mật khẩu
                                        </Button>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h4 className="font-medium text-foreground mb-4">Phiên đăng nhập</h4>
                                    <p className="text-sm text-foreground-secondary mb-4">
                                        Bạn đang đăng nhập từ 1 thiết bị. Nhấn nút bên dưới để đăng xuất khỏi tất cả thiết bị khác.
                                    </p>
                                    <Button variant="destructive">
                                        Đăng xuất tất cả thiết bị khác
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Venue Modal */}
            <VenueFormModal
                isOpen={isVenueModalOpen}
                onClose={() => {
                    setIsVenueModalOpen(false);
                    setEditingVenue(null);
                }}
                venue={editingVenue}
                onSave={handleSaveVenue}
            />
        </div>
    );
}
