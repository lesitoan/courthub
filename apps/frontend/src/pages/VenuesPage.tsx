import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Building2,
    Clock,
    MapPin,
    Phone,
    Pencil,
    Trash2,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { venueApi, Venue, CreateVenueInput } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VenueFormData {
    name: string;
    address: string;
    phone: string;
    openTime: string;
    closeTime: string;
}

const defaultFormData: VenueFormData = {
    name: '',
    address: '',
    phone: '',
    openTime: '06:00',
    closeTime: '23:00',
};

export default function VenuesPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [formData, setFormData] = useState<VenueFormData>(defaultFormData);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Fetch venues
    const { data: venuesData, isLoading } = useQuery({
        queryKey: ['venues'],
        queryFn: () => venueApi.getAll({}),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: CreateVenueInput) => venueApi.create(data),
        onSuccess: () => {
            toast({ title: 'Đã tạo cơ sở mới!' });
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            handleCloseModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi tạo cơ sở', variant: 'error' });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateVenueInput> }) =>
            venueApi.update(id, data),
        onSuccess: () => {
            toast({ title: 'Đã cập nhật cơ sở!' });
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            handleCloseModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi cập nhật cơ sở', variant: 'error' });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => venueApi.delete(id),
        onSuccess: () => {
            toast({ title: 'Đã xóa cơ sở!' });
            queryClient.invalidateQueries({ queryKey: ['venues'] });
            setDeleteConfirm(null);
        },
        onError: () => {
            toast({ title: 'Lỗi khi xóa cơ sở', variant: 'error' });
        },
    });

    const handleOpenModal = (venue?: Venue) => {
        if (venue) {
            setEditingVenue(venue);
            setFormData({
                name: venue.name,
                address: venue.address,
                phone: venue.phone || '',
                openTime: venue.openTime,
                closeTime: venue.closeTime,
            });
        } else {
            setEditingVenue(null);
            setFormData(defaultFormData);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVenue(null);
        setFormData(defaultFormData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast({ title: 'Vui lòng nhập tên cơ sở', variant: 'error' });
            return;
        }

        if (!formData.address.trim()) {
            toast({ title: 'Vui lòng nhập địa chỉ', variant: 'error' });
            return;
        }

        const data: CreateVenueInput = {
            name: formData.name.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim() || undefined,
            openTime: formData.openTime,
            closeTime: formData.closeTime,
        };

        if (editingVenue) {
            updateMutation.mutate({ id: editingVenue.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quản lý cơ sở</h1>
                    <p className="text-foreground-secondary">Quản lý các cơ sở, chi nhánh của bạn</p>
                </div>
                <Button className="gap-2" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4" />
                    Thêm cơ sở
                </Button>
            </div>

            {/* Venues Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                </div>
            ) : venuesData?.data.length === 0 ? (
                <div className="bg-background-secondary rounded-xl border border-border p-12 text-center">
                    <Building2 className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Chưa có cơ sở nào</h3>
                    <p className="text-foreground-secondary mb-4">Tạo cơ sở đầu tiên để bắt đầu quản lý</p>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm cơ sở
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venuesData?.data.map((venue: Venue) => (
                        <div
                            key={venue.id}
                            className="bg-background-secondary rounded-xl border border-border p-6 hover:border-primary-500/50 transition-colors"
                        >
                            {/* Venue Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{venue.name}</h3>
                                        <span className={cn(
                                            'text-xs px-2 py-0.5 rounded-full',
                                            venue.isActive
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                        )}>
                                            {venue.isActive ? 'Hoạt động' : 'Đóng cửa'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenModal(venue)}
                                        className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil className="w-4 h-4 text-foreground-secondary" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(venue.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Venue Info */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-foreground-muted mt-0.5" />
                                    <span className="text-foreground-secondary">{venue.address}</span>
                                </div>
                                {venue.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-foreground-muted" />
                                        <span className="text-foreground-secondary">{venue.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-foreground-muted" />
                                    <span className="text-foreground-secondary">
                                        {venue.openTime} - {venue.closeTime}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {venue._count?.courts || 0}
                                    </div>
                                    <div className="text-xs text-foreground-secondary">Sân</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {venue._count?.pricingRules || 0}
                                    </div>
                                    <div className="text-xs text-foreground-secondary">Bảng giá</div>
                                </div>
                            </div>

                            {/* Delete Confirmation */}
                            {deleteConfirm === venue.id && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Xác nhận xóa?</span>
                                    </div>
                                    <p className="text-sm text-foreground-secondary mb-3">
                                        Hành động này không thể hoàn tác!
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteMutation.mutate(venue.id)}
                                            isLoading={deleteMutation.isPending}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleCloseModal}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div
                            className="bg-background-secondary rounded-2xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">
                                    {editingVenue ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở mới'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                                >
                                    <X className="w-5 h-5 text-foreground-secondary" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                        Tên cơ sở *
                                    </label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Courtify Phú Nhuận"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                        Địa chỉ *
                                    </label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="VD: 123 Nguyễn Văn Trỗi, Quận Phú Nhuận"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                        Số điện thoại
                                    </label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="VD: 0901234567"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                            Giờ mở cửa
                                        </label>
                                        <Input
                                            type="time"
                                            value={formData.openTime}
                                            onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1.5">
                                            Giờ đóng cửa
                                        </label>
                                        <Input
                                            type="time"
                                            value={formData.closeTime}
                                            onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-background-tertiary rounded-b-2xl">
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    isLoading={createMutation.isPending || updateMutation.isPending}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    {editingVenue ? 'Cập nhật' : 'Tạo cơ sở'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
