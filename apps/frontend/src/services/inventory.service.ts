import api, { ApiResponse } from './api';

export interface Product {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    unit: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    venue?: {
        id: string;
        name: string;
    };
}

export interface Service {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    price: number;
    unit: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    venue?: {
        id: string;
        name: string;
    };
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

export interface CreateProductInput {
    venueId: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    unit?: string;
}

export interface CreateServiceInput {
    venueId: string;
    name: string;
    description?: string;
    price: number;
    unit?: string;
}

// Product API
export const productApi = {
    async getAll(params?: {
        venueId?: string;
        isActive?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();
        if (params?.venueId) queryParams.append('venueId', params.venueId);
        if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const response = await api.get<ApiResponse<Product[]> & { pagination: PaginatedResponse<Product>['pagination'] }>(
            `/products?${queryParams}`
        );
        return {
            data: response.data.data || [],
            pagination: response.data.pagination,
        };
    },

    async getById(id: string): Promise<Product> {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data.data!;
    },

    async create(input: CreateProductInput): Promise<Product> {
        const response = await api.post<ApiResponse<Product>>('/products', input);
        return response.data.data!;
    },

    async update(id: string, input: Partial<CreateProductInput> & { isActive?: boolean }): Promise<Product> {
        const response = await api.put<ApiResponse<Product>>(`/products/${id}`, input);
        return response.data.data!;
    },

    async updateStock(id: string, quantity: number, type: 'add' | 'subtract'): Promise<Product> {
        const response = await api.patch<ApiResponse<Product>>(`/products/${id}/stock`, { quantity, type });
        return response.data.data!;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/products/${id}`);
    },

    async getLowStock(venueId?: string, threshold?: number): Promise<Product[]> {
        const queryParams = new URLSearchParams();
        if (venueId) queryParams.append('venueId', venueId);
        if (threshold) queryParams.append('threshold', String(threshold));

        const response = await api.get<ApiResponse<Product[]>>(`/products/low-stock?${queryParams}`);
        return response.data.data || [];
    },
};

// Service API
export const serviceApi = {
    async getAll(params?: {
        venueId?: string;
        isActive?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Service>> {
        const queryParams = new URLSearchParams();
        if (params?.venueId) queryParams.append('venueId', params.venueId);
        if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const response = await api.get<ApiResponse<Service[]> & { pagination: PaginatedResponse<Service>['pagination'] }>(
            `/services?${queryParams}`
        );
        return {
            data: response.data.data || [],
            pagination: response.data.pagination,
        };
    },

    async getById(id: string): Promise<Service> {
        const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
        return response.data.data!;
    },

    async create(input: CreateServiceInput): Promise<Service> {
        const response = await api.post<ApiResponse<Service>>('/services', input);
        return response.data.data!;
    },

    async update(id: string, input: Partial<CreateServiceInput> & { isActive?: boolean }): Promise<Service> {
        const response = await api.put<ApiResponse<Service>>(`/services/${id}`, input);
        return response.data.data!;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/services/${id}`);
    },
};
