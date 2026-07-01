import api, { ApiResponse } from './api';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    bookingId?: string;
    productId?: string;
    serviceId?: string;
    booking?: {
        id: string;
        startTime: string;
        endTime: string;
        date: string;
        court?: { name: string };
    };
    product?: { id: string; name: string };
    service?: { id: string; name: string };
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId?: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
    paymentMethod?: string;
    paidAmount: number;
    paidAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    customer?: {
        id: string;
        name: string;
        phone: string;
        membershipTier?: string;
    };
    items: InvoiceItem[];
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateInvoiceInput {
    customerId?: string;
    bookingIds?: string[];
    productItems?: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
    }>;
    serviceItems?: Array<{
        serviceId: string;
        quantity: number;
        unitPrice: number;
    }>;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    paymentMethod?: string;
    notes?: string;
}

export interface DailySummary {
    date: string;
    invoiceCount: number;
    totalRevenue: number;
}

export const invoiceApi = {
    async getAll(params?: {
        customerId?: string;
        paymentStatus?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Invoice>> {
        const queryParams = new URLSearchParams();
        if (params?.customerId) queryParams.append('customerId', params.customerId);
        if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const response = await api.get<ApiResponse<Invoice[]> & { pagination: PaginatedResponse<Invoice>['pagination'] }>(
            `/invoices?${queryParams}`
        );
        return {
            data: response.data.data || [],
            pagination: response.data.pagination,
        };
    },

    async getById(id: string): Promise<Invoice> {
        const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
        return response.data.data!;
    },

    async create(input: CreateInvoiceInput): Promise<Invoice> {
        const response = await api.post<ApiResponse<Invoice>>('/invoices', input);
        return response.data.data!;
    },

    async pay(id: string): Promise<Invoice> {
        const response = await api.post<ApiResponse<Invoice>>(`/invoices/${id}/pay`);
        return response.data.data!;
    },

    async cancel(id: string, reason?: string): Promise<Invoice> {
        const response = await api.post<ApiResponse<Invoice>>(`/invoices/${id}/cancel`, { reason });
        return response.data.data!;
    },

    async getDailySummary(date?: string): Promise<DailySummary> {
        const queryParams = new URLSearchParams();
        if (date) queryParams.append('date', date);

        const response = await api.get<ApiResponse<DailySummary>>(`/invoices/summary/daily?${queryParams}`);
        return response.data.data!;
    },
};

export default invoiceApi;
