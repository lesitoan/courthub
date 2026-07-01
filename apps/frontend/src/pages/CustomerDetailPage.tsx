import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Calendar,
    Trophy,
    Star,
    Edit2,
    Trash2,
    CreditCard,
    TrendingUp,
    Gift
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { customerApi } from '@/services/customer.service';
import { CustomerBookingHistory } from '@/components/customer';
import { useToast } from '@/hooks/use-toast';

function getMembershipConfig(tier?: string) {
    switch (tier) {
        case 'PLATINUM':
            return { label: 'Platinum', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' };
        case 'GOLD':
            return { label: 'Vàng', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' };
        case 'SILVER':
            return { label: 'Bạc', color: 'bg-gray-400/20 text-gray-300 border-gray-400/50' };
        case 'BRONZE':
            return { label: 'Đồng', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' };
        default:
            return { label: 'Thường', color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' };
    }
}

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'history' | 'points' | 'notes'>('history');

    const { data: customer, isLoading, error } = useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerApi.getById(id!),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: (customerId: string) => customerApi.delete(customerId),
        onSuccess: () => {
            toast({ title: 'Đã xóa khách hàng' });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            navigate('/customers');
        },
        onError: () => {
            toast({ title: 'Lỗi khi xóa khách hàng', variant: 'error' });
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-48 bg-background-tertiary rounded animate-pulse" />
                <div className="h-64 bg-background-tertiary rounded-xl animate-pulse" />
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="p-6">
                <div className="text-center py-16">
                    <User className="w-12 h-12 mx-auto mb-4 text-foreground-muted opacity-50" />
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                        Không tìm thấy khách hàng
                    </h2>
                    <Button onClick={() => navigate('/customers')}>Quay lại</Button>
                </div>
            </div>
        );
    }

    const membershipConfig = getMembershipConfig(customer.membershipTier);

    const tabs = [
        { id: 'history' as const, label: 'Lịch sử đặt sân' },
        { id: 'points' as const, label: 'Điểm tích lũy' },
        { id: 'notes' as const, label: 'Ghi chú' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/customers')}
                    className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground-secondary" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Chi tiết khách hàng</h1>
                    <p className="text-foreground-secondary">Xem và quản lý thông tin khách hàng</p>
                </div>
            </div>

            {/* Customer profile card */}
            <div className="bg-background-secondary border border-border rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-500 font-bold text-3xl">
                                {customer.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {customer.name}
                                </h2>
                                <span className={cn(
                                    'text-xs px-2 py-0.5 rounded-full font-medium border',
                                    membershipConfig.color
                                )}>
                                    <Trophy className="w-3 h-3 inline mr-1" />
                                    {membershipConfig.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-foreground-secondary">
                                <div className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {customer.phone}
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {customer.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:ml-auto">
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Sửa
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
                                    deleteMutation.mutate(customer.id);
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="bg-background-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                            <Calendar className="w-4 h-4" />
                            Lượt đặt
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {customer.totalBookings || 0}
                        </p>
                    </div>
                    <div className="bg-background-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                            <CreditCard className="w-4 h-4" />
                            Tổng chi tiêu
                        </div>
                        <p className="text-2xl font-bold text-primary-500">
                            {formatCurrency(customer.totalSpent || 0)}
                        </p>
                    </div>
                    <div className="bg-background-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                            <Star className="w-4 h-4" />
                            Điểm tích lũy
                        </div>
                        <p className="text-2xl font-bold text-yellow-500">
                            {customer.points?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="bg-background-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
                            <TrendingUp className="w-4 h-4" />
                            TB/tháng
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {Math.round((customer.totalBookings || 0) / 12)} lượt
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-background-secondary border border-border rounded-xl">
                <div className="flex border-b border-border">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'px-6 py-3 text-sm font-medium transition-colors relative',
                                activeTab === tab.id
                                    ? 'text-primary-500'
                                    : 'text-foreground-secondary hover:text-foreground'
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4">
                    {activeTab === 'history' && (
                        <CustomerBookingHistory customerId={customer.id} />
                    )}

                    {activeTab === 'points' && (
                        <div className="py-8 text-center text-foreground-muted">
                            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="font-medium text-foreground mb-2">Lịch sử điểm</h3>
                            <p className="text-sm">
                                Điểm hiện tại: <strong className="text-yellow-500">{customer.points?.toLocaleString() || 0}</strong>
                            </p>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="py-8 text-center text-foreground-muted">
                            <Edit2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="font-medium text-foreground mb-2">Ghi chú</h3>
                            <p className="text-sm">Chưa có ghi chú nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
