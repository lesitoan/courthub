import api, { ApiResponse } from './api';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    membershipStart?: string;
    membershipEnd?: string;
    totalBookings: number;
    totalSpent: number;
    points: number;
    notes?: string;
    createdAt: string;
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

export interface CreateCustomerInput {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}

export const customerApi = {
    async getAll(params?: {
        search?: string;
        membershipTier?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Customer>> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.membershipTier) queryParams.append('membershipTier', params.membershipTier);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const response = await api.get<ApiResponse<Customer[]> & { pagination: PaginatedResponse<Customer>['pagination'] }>(
            `/customers?${queryParams}`
        );
        return {
            data: response.data.data || [],
            pagination: response.data.pagination,
        };
    },

    async getById(id: string): Promise<Customer> {
        const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
        return response.data.data!;
    },

    async create(input: CreateCustomerInput): Promise<Customer> {
        const response = await api.post<ApiResponse<Customer>>('/customers', input);
        return response.data.data!;
    },

    async update(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
        const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, input);
        return response.data.data!;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/customers/${id}`);
    },

    async searchByPhone(phone: string): Promise<Customer | null> {
        const response = await api.get<ApiResponse<Customer>>(`/customers/search?phone=${phone}`);
        return response.data.data || null;
    },

    async addPoints(id: string, points: number): Promise<Customer> {
        const response = await api.post<ApiResponse<Customer>>(`/customers/${id}/points`, { points });
        return response.data.data!;
    },
};

export default customerApi;
