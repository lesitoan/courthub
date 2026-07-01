import api, { ApiResponse } from './api';

export interface PublicVenue {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    description?: string;
    logo?: string;
    openTime: string;
    closeTime: string;
}

export interface PublicCourt {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    surfaceType?: string;
    isIndoor: boolean;
    status: string;
    sortOrder: number;
    venue?: Pick<PublicVenue, 'id' | 'name' | 'openTime' | 'closeTime'>;
}

export interface PublicProduct {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    unit: string;
}

export interface PublicService {
    id: string;
    venueId: string;
    name: string;
    description?: string;
    price: number;
    unit: string;
}

export interface PublicAddon {
    type: 'product' | 'service';
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    total: number;
}

export interface PublicTimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
    isPast: boolean;
    price: number;
    pricePerHour: number;
    appliedRule?: string;
}

export interface PublicCustomer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    membershipTier?: string;
    totalBookings: number;
    totalSpent: number;
    points: number;
}

export interface PublicBooking {
    id: string;
    bookingCode: string;
    courtId: string;
    customerId?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    totalAmount: number;
    courtAmount: number;
    addonTotal: number;
    notes?: string;
    source: string;
    addons: PublicAddon[];
    canChange: boolean;
    estimatedPoints: number;
    court: PublicCourt & { venue: PublicVenue };
    customer?: PublicCustomer;
}

export interface CreatePublicBookingInput {
    venueId: string;
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    addons?: Array<{ type: 'product' | 'service'; id: string; quantity: number }>;
}

export interface PublicLookupResult {
    customer: PublicCustomer | null;
    bookings: PublicBooking[];
    summary: {
        points: number;
        totalBookings: number;
        totalSpent: number;
    };
}

export const publicBookingApi = {
    async getVenues(): Promise<PublicVenue[]> {
        const response = await api.get<ApiResponse<PublicVenue[]>>('/public/venues');
        return response.data.data || [];
    },

    async getCourts(venueId: string): Promise<PublicCourt[]> {
        const response = await api.get<ApiResponse<PublicCourt[]>>(`/public/venues/${venueId}/courts`);
        return response.data.data || [];
    },

    async getAddons(venueId: string): Promise<{ products: PublicProduct[]; services: PublicService[] }> {
        const response = await api.get<ApiResponse<{ products: PublicProduct[]; services: PublicService[] }>>(
            `/public/venues/${venueId}/addons`
        );
        return response.data.data || { products: [], services: [] };
    },

    async getAvailability(courtId: string, date: string, excludeId?: string): Promise<PublicTimeSlot[]> {
        const excludeQuery = excludeId ? `&excludeId=${encodeURIComponent(excludeId)}` : '';
        const response = await api.get<ApiResponse<{ slots: PublicTimeSlot[] }>>(
            `/public/courts/${courtId}/availability?date=${date}${excludeQuery}`
        );
        return response.data.data?.slots || [];
    },

    async createBooking(input: CreatePublicBookingInput): Promise<{ booking: PublicBooking }> {
        const response = await api.post<ApiResponse<{ booking: PublicBooking }>>('/public/bookings', input);
        return response.data.data!;
    },

    async lookup(phone: string): Promise<PublicLookupResult> {
        const response = await api.get<ApiResponse<PublicLookupResult>>(
            `/public/bookings/lookup?phone=${encodeURIComponent(phone)}`
        );
        return response.data.data!;
    },

    async getBooking(id: string): Promise<PublicBooking> {
        const response = await api.get<ApiResponse<PublicBooking>>(`/public/bookings/${id}`);
        return response.data.data!;
    },

    async reschedule(id: string, input: {
        phone: string;
        courtId?: string;
        date: string;
        startTime: string;
        endTime: string;
        reason?: string;
    }): Promise<PublicBooking> {
        const response = await api.patch<ApiResponse<PublicBooking>>(`/public/bookings/${id}/reschedule`, input);
        return response.data.data!;
    },

    async cancel(id: string, input: { phone: string; reason?: string }): Promise<PublicBooking> {
        const response = await api.post<ApiResponse<PublicBooking>>(`/public/bookings/${id}/cancel`, input);
        return response.data.data!;
    },
};
