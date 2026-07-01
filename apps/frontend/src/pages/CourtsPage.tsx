import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Edit2,
    Trash2,
    MapPin,
    X,
    Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { venueApi, courtApi, Venue, Court } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';

function getStatusColor(status: string): string {
    switch (status) {
        case 'ACTIVE': return 'bg-green-500/20 text-green-400 border-green-500';
        case 'MAINTENANCE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
        case 'INACTIVE': return 'bg-red-500/20 text-red-400 border-red-500';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
}

function getStatusLabel(status: string): string {
    switch (status) {
        case 'ACTIVE': return 'Hoạt động';
        case 'MAINTENANCE': return 'Bảo trì';
        case 'INACTIVE': return 'Tạm dừng';
        default: return status;
    }
}

interface CourtFormData {
    name: string;
    description: string;
    surfaceType: string;
    isIndoor: boolean;
    status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export default function CourtsPage() {
    const [selectedVenueId, setSelectedVenueId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);
    const [formData, setFormData] = useState<CourtFormData>({
        name: '',
        description: '',
        surfaceType: 'Synthetic',
        isIndoor: true,
        status: 'ACTIVE',
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch venues
    const { data: venuesData } = useQuery({
        queryKey: ['venues'],
        queryFn: () => venueApi.getAll({ isActive: true }),
    });

    // Set first venue as default
    useEffect(() => {
        if (venuesData?.data && venuesData.data.length > 0 && !selectedVenueId) {
            setSelectedVenueId(venuesData.data[0].id);
        }
    }, [venuesData, selectedVenueId]);

    // Fetch courts for selected venue
    const { data: courts, isLoading } = useQuery({
        queryKey: ['courts', selectedVenueId],
        queryFn: () => courtApi.getByVenue(selectedVenueId),
        enabled: !!selectedVenueId,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (input: Partial<Court>) => courtApi.create(input),
        onSuccess: () => {
            toast({ title: 'Thêm sân thành công!' });
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            closeModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi thêm sân', variant: 'error' });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<Court> }) =>
            courtApi.update(id, input),
        onSuccess: () => {
            toast({ title: 'Cập nhật thành công!' });
            queryClient.invalidateQueries({ queryKey: ['courts'] });
            closeModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi cập nhật', variant: 'error' });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => courtApi.delete(id),
        onSuccess: () => {
            toast({ title: 'Đã xóa sân!' });
            queryClient.invalidateQueries({ queryKey: ['courts'] });
        },
        onError: () => {
            toast({ title: 'Lỗi khi xóa', variant: 'error' });
        },
    });

    const openCreateModal = () => {
        setEditingCourt(null);
        setFormData({
            name: '',
            description: '',
            surfaceType: 'Synthetic',
            isIndoor: true,
            status: 'ACTIVE',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (court: Court) => {
        setEditingCourt(court);
        setFormData({
            name: court.name,
            description: court.description || '',
            surfaceType: court.surfaceType || 'Synthetic',
            isIndoor: court.isIndoor,
            status: court.status,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourt(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourt) {
            updateMutation.mutate({ id: editingCourt.id, input: formData });
        } else {
            createMutation.mutate({ ...formData, venueId: selectedVenueId });
        }
    };

    const handleDelete = (court: Court) => {
        if (confirm('Ban co chac muon xoa san "' + court.name + '"?')) {
            deleteMutation.mutate(court.id);
        }
    };

    const selectedVenue = venuesData?.data.find((v: Venue) => v.id === selectedVenueId);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quản Lý Sân</h1>
                    <p className="text-foreground-secondary">Quản lý danh sách sân cầu lông</p>
                </div>

                <Button className="gap-2" onClick={openCreateModal} disabled={!selectedVenueId}>
                    <Plus className="w-4 h-4" />
                    Thêm sân mới
                </Button>
            </div>

            {/* Venue Selector */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-background-secondary rounded-lg border border-border">
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-foreground-secondary" />
                    <span className="text-foreground-secondary">Cơ sở:</span>
                </div>
                <select
                    value={selectedVenueId}
                    onChange={(e) => setSelectedVenueId(e.target.value)}
                    className="flex-1 max-w-md bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {venuesData?.data.map((venue: Venue) => (
                        <option key={venue.id} value={venue.id}>
                            {venue.name}
                        </option>
                    ))}
                </select>

                {selectedVenue && (
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedVenue.address}</span>
                    </div>
                )}
            </div>

            {/* Courts Grid */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                    </div>
                ) : !courts || courts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-foreground-secondary">
                        <Building2 className="w-12 h-12 mb-4 opacity-50" />
                        <p>Chưa có sân nào được thiết lập</p>
                        <Button className="mt-4 gap-2" onClick={openCreateModal}>
                            <Plus className="w-4 h-4" />
                            Thêm sân đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courts.map((court: Court) => (
                            <div
                                key={court.id}
                                className="bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-all"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg">{court.name}</h3>
                                        {court.description && (
                                            <p className="text-sm text-foreground-secondary mt-1">
                                                {court.description}
                                            </p>
                                        )}
                                    </div>
                                    <span className={cn(
                                        'px-2 py-1 rounded text-xs font-medium border',
                                        getStatusColor(court.status)
                                    )}>
                                        {getStatusLabel(court.status)}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                                        <span className="text-foreground-secondary">Loại sàn:</span>
                                        <span className="text-foreground">{court.surfaceType || 'Chưa xác định'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-foreground-secondary">Vị trí:</span>
                                        <span className="text-foreground">{court.isIndoor ? 'Trong nhà' : 'Ngoài trời'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => openEditModal(court)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-400"
                                        onClick={() => handleDelete(court)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold">
                                {editingCourt ? 'Sửa thông tin sân' : 'Thêm sân mới'}
                            </h3>
                            <button onClick={closeModal} className="p-1 hover:bg-background-hover rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Tên sân <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="VD: Sân A1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    placeholder="Mô tả về sân..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-foreground-secondary mb-1">
                                        Loại sàn
                                    </label>
                                    <select
                                        value={formData.surfaceType}
                                        onChange={(e) => setFormData({ ...formData, surfaceType: e.target.value })}
                                        className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="Synthetic">Sàn nhựa tổng hợp</option>
                                        <option value="Wooden">Sàn gỗ</option>
                                        <option value="Synthetic Pro">Synthetic Pro</option>
                                        <option value="PVC">PVC</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-foreground-secondary mb-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Court['status'] })}
                                        className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="MAINTENANCE">Bảo trì</option>
                                        <option value="INACTIVE">Tạm dừng</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isIndoor}
                                        onChange={(e) => setFormData({ ...formData, isIndoor: e.target.checked })}
                                        className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-foreground">Sân trong nhà</span>
                                </label>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={closeModal}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {editingCourt ? 'Lưu' : 'Thêm'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
