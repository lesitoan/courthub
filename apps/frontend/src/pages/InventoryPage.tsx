import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Package,
    Wrench,
    Plus,
    Search,
    Edit2,
    Trash2,
    AlertTriangle,
    X,
    Save
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { productApi, serviceApi, Product, Service, CreateProductInput, CreateServiceInput } from '@/services/inventory.service';
import { venueApi, Venue } from '@/services/venue.service';
import { useToast } from '@/hooks/use-toast';

type Tab = 'products' | 'services';

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | Service | null>(null);

    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch venues for dropdown
    const { data: venuesData } = useQuery({
        queryKey: ['venues'],
        queryFn: () => venueApi.getAll({ isActive: true }),
    });

    // Fetch products
    const { data: productsData, isLoading: loadingProducts } = useQuery({
        queryKey: ['products', searchQuery],
        queryFn: () => productApi.getAll({ search: searchQuery, isActive: true }),
        enabled: activeTab === 'products',
    });

    // Fetch services
    const { data: servicesData, isLoading: loadingServices } = useQuery({
        queryKey: ['services', searchQuery],
        queryFn: () => serviceApi.getAll({ search: searchQuery, isActive: true }),
        enabled: activeTab === 'services',
    });

    // Fetch low stock products
    const { data: lowStockProducts } = useQuery({
        queryKey: ['products', 'low-stock'],
        queryFn: () => productApi.getLowStock(undefined, 10),
    });

    // Mutations
    const createProductMutation = useMutation({
        mutationFn: (input: CreateProductInput) => productApi.create(input),
        onSuccess: () => {
            toast({ title: 'Đã thêm sản phẩm!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setShowModal(false);
        },
        onError: () => toast({ title: 'Lỗi khi thêm sản phẩm', variant: 'error' }),
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductInput> }) =>
            productApi.update(id, data),
        onSuccess: () => {
            toast({ title: 'Đã cập nhật sản phẩm!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setShowModal(false);
            setEditingItem(null);
        },
        onError: () => toast({ title: 'Lỗi khi cập nhật', variant: 'error' }),
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => productApi.delete(id),
        onSuccess: () => {
            toast({ title: 'Đã xóa sản phẩm!' });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => toast({ title: 'Lỗi khi xóa', variant: 'error' }),
    });

    const createServiceMutation = useMutation({
        mutationFn: (input: CreateServiceInput) => serviceApi.create(input),
        onSuccess: () => {
            toast({ title: 'Đã thêm dịch vụ!' });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setShowModal(false);
        },
        onError: () => toast({ title: 'Lỗi khi thêm dịch vụ', variant: 'error' }),
    });

    const updateServiceMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateServiceInput> }) =>
            serviceApi.update(id, data),
        onSuccess: () => {
            toast({ title: 'Đã cập nhật dịch vụ!' });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setShowModal(false);
            setEditingItem(null);
        },
        onError: () => toast({ title: 'Lỗi khi cập nhật', variant: 'error' }),
    });

    const deleteServiceMutation = useMutation({
        mutationFn: (id: string) => serviceApi.delete(id),
        onSuccess: () => {
            toast({ title: 'Đã xóa dịch vụ!' });
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: () => toast({ title: 'Lỗi khi xóa', variant: 'error' }),
    });

    const products = productsData?.data || [];
    const services = servicesData?.data || [];
    const venues = venuesData?.data || [];
    const isLoading = activeTab === 'products' ? loadingProducts : loadingServices;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Kho & Dịch Vụ</h1>
                    <p className="text-foreground-secondary">Quản lý sản phẩm và dịch vụ</p>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowModal(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm {activeTab === 'products' ? 'sản phẩm' : 'dịch vụ'}
                </Button>
            </div>

            {/* Low Stock Warning */}
            {lowStockProducts && lowStockProducts.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-yellow-400">Cảnh báo tồn kho</h4>
                        <p className="text-sm text-foreground-secondary mt-1">
                            Có {lowStockProducts.length} sản phẩm sắp hết hàng: {' '}
                            {lowStockProducts.slice(0, 3).map(p => p.name).join(', ')}
                            {lowStockProducts.length > 3 && '...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('products')}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                        activeTab === 'products'
                            ? 'bg-primary-500 text-white'
                            : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'
                    )}
                >
                    <Package className="w-4 h-4" />
                    Sản phẩm ({products.length})
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                        activeTab === 'services'
                            ? 'bg-primary-500 text-white'
                            : 'bg-background-secondary text-foreground-secondary hover:bg-background-hover'
                    )}
                >
                    <Wrench className="w-4 h-4" />
                    Dịch vụ ({services.length})
                </button>

                {/* Search */}
                <div className="relative flex-1 max-w-md ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
                    </div>
                ) : activeTab === 'products' ? (
                    <ProductsGrid
                        products={products}
                        onEdit={(p) => { setEditingItem(p); setShowModal(true); }}
                        onDelete={(id) => deleteProductMutation.mutate(id)}
                    />
                ) : (
                    <ServicesGrid
                        services={services}
                        onEdit={(s) => { setEditingItem(s); setShowModal(true); }}
                        onDelete={(id) => deleteServiceMutation.mutate(id)}
                    />
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <ItemModal
                    type={activeTab === 'products' ? 'product' : 'service'}
                    item={editingItem}
                    venues={venues}
                    onClose={() => { setShowModal(false); setEditingItem(null); }}
                    onSave={(data) => {
                        if (activeTab === 'products') {
                            if (editingItem) {
                                updateProductMutation.mutate({ id: editingItem.id, data });
                            } else {
                                createProductMutation.mutate(data as CreateProductInput);
                            }
                        } else {
                            if (editingItem) {
                                updateServiceMutation.mutate({ id: editingItem.id, data });
                            } else {
                                createServiceMutation.mutate(data as CreateServiceInput);
                            }
                        }
                    }}
                />
            )}
        </div>
    );
}

// Products Grid Component
function ProductsGrid({
    products,
    onEdit,
    onDelete
}: {
    products: Product[];
    onEdit: (p: Product) => void;
    onDelete: (id: string) => void;
}) {
    if (!products.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-foreground-secondary">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>Chưa có sản phẩm nào</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <div key={product.id} className="bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(product)}
                                className="p-2 hover:bg-background-hover rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4 text-foreground-secondary" />
                            </button>
                            <button
                                onClick={() => onDelete(product.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{product.name}</h4>
                    <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
                        {product.description || 'Không có mô tả'}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-500">{formatCurrency(product.price)}</span>
                        <span className={cn(
                            'text-sm px-2 py-1 rounded',
                            product.stock <= 10
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-green-500/20 text-green-400'
                        )}>
                            Kho: {product.stock} {product.unit}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Services Grid Component
function ServicesGrid({
    services,
    onEdit,
    onDelete
}: {
    services: Service[];
    onEdit: (s: Service) => void;
    onDelete: (id: string) => void;
}) {
    if (!services.length) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-foreground-secondary">
                <Wrench className="w-12 h-12 mb-4 opacity-50" />
                <p>Chưa có dịch vụ nào</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service) => (
                <div key={service.id} className="bg-background-secondary border border-border rounded-lg p-4 hover:border-primary-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(service)}
                                className="p-2 hover:bg-background-hover rounded-lg transition-colors"
                            >
                                <Edit2 className="w-4 h-4 text-foreground-secondary" />
                            </button>
                            <button
                                onClick={() => onDelete(service.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{service.name}</h4>
                    <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
                        {service.description || 'Không có mô tả'}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary-500">{formatCurrency(service.price)}/{service.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Modal Component
function ItemModal({
    type,
    item,
    venues,
    onClose,
    onSave
}: {
    type: 'product' | 'service';
    item: Product | Service | null;
    venues: Venue[];
    onClose: () => void;
    onSave: (data: CreateProductInput | CreateServiceInput) => void;
}) {
    const [formData, setFormData] = useState({
        venueId: item?.venueId || venues[0]?.id || '',
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price || 0,
        stock: (item as Product)?.stock || 0,
        unit: item?.unit || (type === 'product' ? 'cái' : 'lần'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'product') {
            onSave({
                venueId: formData.venueId,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                unit: formData.unit,
            });
        } else {
            onSave({
                venueId: formData.venueId,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                unit: formData.unit,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background-secondary border border-border rounded-xl shadow-xl w-full max-w-md animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">
                        {item ? 'Chỉnh sửa' : 'Thêm'} {type === 'product' ? 'sản phẩm' : 'dịch vụ'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-background-hover rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Venue */}
                    {!item && (
                        <div>
                            <label className="block text-sm text-foreground-secondary mb-1">Cơ sở</label>
                            <select
                                value={formData.venueId}
                                onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground"
                                required
                            >
                                {venues.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm text-foreground-secondary mb-1">Tên</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground"
                            placeholder={type === 'product' ? 'VD: Cầu lông Yonex' : 'VD: Thuê vợt'}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-foreground-secondary mb-1">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground resize-none"
                            rows={2}
                            placeholder="Mô tả ngắn..."
                        />
                    </div>

                    {/* Price & Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-foreground-secondary mb-1">Giá (VNĐ)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-foreground-secondary mb-1">Đơn vị</label>
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground"
                                placeholder={type === 'product' ? 'cái, quả, chai...' : 'lần, giờ...'}
                            />
                        </div>
                    </div>

                    {/* Stock (products only) */}
                    {type === 'product' && (
                        <div>
                            <label className="block text-sm text-foreground-secondary mb-1">Số lượng tồn kho</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full bg-background-tertiary border border-border rounded-lg px-3 py-2 text-foreground"
                                min="0"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" className="flex-1 gap-2">
                            <Save className="w-4 h-4" />
                            {item ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
