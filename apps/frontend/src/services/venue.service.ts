import api, { ApiResponse } from './api';

export interface Venue {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    description?: string;
    logo?: string;
    openTime: string;
    closeTime: string;
    isActive: boolean;
    _count?: {
        courts: number;
        staff: number;
        pricingRules?: number;
    };
}

export interface CreateVenueInput {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    description?: string;
    openTime: string;
    closeTime: string;
}

export interface Court {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    surfaceType?: string;
    isIndoor: boolean;
    status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
    sortOrder: number;
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

export const venueApi = {
    async getAll(params?: {
        search?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<Venue>> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const response = await api.get<ApiResponse<Venue[]> & { pagination: any }>(
            `/venues?${queryParams}`
        );
        return {
            data: response.data.data || [],
            pagination: response.data.pagination,
        };
    },

    async getById(id: string): Promise<Venue & { courts: Court[] }> {
        const response = await api.get<ApiResponse<Venue & { courts: Court[] }>>(`/venues/${id}`);
        return response.data.data!;
    },

    async create(input: Partial<Venue>): Promise<Venue> {
        const response = await api.post<ApiResponse<Venue>>('/venues', input);
        return response.data.data!;
    },

    async update(id: string, input: Partial<Venue>): Promise<Venue> {
        const response = await api.put<ApiResponse<Venue>>(`/venues/${id}`, input);
        return response.data.data!;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/venues/${id}`);
    },
};

export const courtApi = {
    async getByVenue(venueId: string): Promise<Court[]> {
        const response = await api.get<ApiResponse<Court[]>>(`/courts/venue/${venueId}`);
        return response.data.data || [];
    },

    async create(input: Partial<Court>): Promise<Court> {
        const response = await api.post<ApiResponse<Court>>('/courts', input);
        return response.data.data!;
    },

    async update(id: string, input: Partial<Court>): Promise<Court> {
        const response = await api.put<ApiResponse<Court>>(`/courts/${id}`, input);
        return response.data.data!;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/courts/${id}`);
    },
};

export default { venueApi, courtApi };
