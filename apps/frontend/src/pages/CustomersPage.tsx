import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Plus,
    User,
    Phone,
    Mail,
    Star,
    Trophy,
    ChevronLeft,
    ChevronRight,
    X,
    Edit2,
    Trash2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { customerApi, Customer, CreateCustomerInput } from '@/services/customer.service';
import { useToast } from '@/hooks/use-toast';

function getMembershipColor(tier?: string): string {
    switch (tier) {
        case 'PLATINUM': return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
        case 'GOLD': return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
        case 'SILVER': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
        case 'BRONZE': return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
        default: return 'bg-gray-500/20 text-gray-400';
    }
}

function getMembershipLabel(tier?: string): string {
    switch (tier) {
        case 'PLATINUM': return 'Bạch Kim';
        case 'GOLD': return 'Vàng';
        case 'SILVER': return 'Bạc';
        case 'BRONZE': return 'Đồng';
        default: return 'Thường';
    }
}

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<CreateCustomerInput>({ name: '', phone: '' });

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch customers
    const { data: customersData, isLoading } = useQuery({
        queryKey: ['customers', searchQuery, selectedTier, page],
        queryFn: () => customerApi.getAll({
            search: searchQuery || undefined,
            membershipTier: selectedTier || undefined,
            page,
            limit: 10,
        }),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (input: CreateCustomerInput) => customerApi.create(input),
        onSuccess: () => {
            toast({ title: 'Thêm khách hàng thành công!' });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            closeModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi thêm khách hàng', variant: 'error' });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: Partial<CreateCustomerInput> }) =>
            customerApi.update(id, input),
        onSuccess: () => {
            toast({ title: 'Cập nhật thành công!' });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            closeModal();
        },
        onError: () => {
            toast({ title: 'Lỗi khi cập nhật', variant: 'error' });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => customerApi.delete(id),
        onSuccess: () => {
            toast({ title: 'Đã xóa khách hàng!' });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: () => {
            toast({ title: 'Lỗi khi xóa', variant: 'error' });
        },
    });

    const openCreateModal = () => {
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '', notes: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || '',
            notes: customer.notes || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            updateMutation.mutate({ id: editingCustomer.id, input: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (customer: Customer) => {
        if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"?`)) {
            deleteMutation.mutate(customer.id);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Khách Hàng</h1>
                    <p className="text-foreground-secondary">
                        Quản lý thông tin khách hàng và thành viên
                    </p>
                </div>

                <Button className="gap-2" onClick={openCreateModal}>
                    <Plus className="w-4 h-4" />
                    Thêm khách hàng
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {/* Membership filter */}
                <select
                    value={selectedTier}
                    onChange={(e) => {
                        setSelectedTier(e.target.value);
                        setPage(1);
                    }}
                    className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Tất cả hạng</option>
                    <option value="PLATINUM">Bạch Kim</option>
                    <option value="GOLD">Vàng</option>
                    <option value="SILVER">Bạc</option>
                    <option value="BRONZE">Đồng</option>
                </select>
            </div>

            {/* Customer List */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                    </div>
                ) : customersData?.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-foreground-secondary">
                        <User className="w-12 h-12 mb-4 opacity-50" />
                        <p>Chưa có khách hàng nào</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {customersData?.data.map((customer) => (
                            <div
                                key={customer.id}
                                className="bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    {/* Customer Info */}
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                            <User className="w-6 h-6 text-primary-500" />
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-foreground">{customer.name}</h3>
                                                <span className={cn(
                                                    'px-2 py-0.5 rounded-full text-xs font-medium',
                                                    getMembershipColor(customer.membershipTier)
                                                )}>
                                                    {getMembershipLabel(customer.membershipTier)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 mt-1 text-sm text-foreground-secondary">
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {customer.phone}
                                                </span>
                                                {customer.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {customer.email}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Trophy className="w-4 h-4 text-amber-500" />
                                                    <span className="text-foreground-secondary">{customer.totalBookings} lần đặt</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-foreground-secondary">{customer.points} điểm</span>
                                                </div>
                                                <div className="text-sm text-primary-500 font-medium">
                                                    {formatCurrency(customer.totalSpent)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(customer)}
                                            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 text-foreground-secondary" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {customersData && customersData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-foreground-secondary">
                        Hiển thị {customersData.data.length} / {customersData.pagination.total} khách hàng
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm">
                            Trang {page} / {customersData.pagination.totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPage(p => Math.min(customersData.pagination.totalPages, p + 1))}
                            disabled={page === customersData.pagination.totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold">
                                {editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
                            </h3>
                            <button onClick={closeModal} className="p-1 hover:bg-background-hover rounded">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Họ tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="0912345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-foreground-secondary mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    placeholder="Ghi chú về khách hàng..."
                                />
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
                                    {editingCustomer ? 'Lưu' : 'Thêm'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
