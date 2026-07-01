import api, { ApiResponse } from './api';

// Types
export interface Booking {
    id: string;
    courtId: string;
    customerId?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    totalAmount: number;
    notes?: string;
    isRecurring?: boolean;
    recurringGroup?: string;
    createdAt: string;
    updatedAt?: string;
    checkedInAt?: string;
    checkedOutAt?: string;
    court: {
        id: string;
        name: string;
        venue?: { id: string; name: string };
    };
    customer?: {
        id: string;
        name: string;
        phone: string;
        membershipTier?: string;
    };
    createdBy?: {
        id: string;
        name: string;
    };
}

export interface Court {
    id: string;
    name: string;
    status: string;
    sortOrder: number;
}

export interface CalendarData {
    courts: Court[];
    bookings: Booking[];
}

export interface CreateBookingInput {
    courtId: string;
    customerId?: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface PricingResult {
    pricePerHour: number;
    duration: number;
    total: number;
    appliedRule?: string;
}

export interface AvailabilityResult {
    available: boolean;
    conflicts: Array<{
        id: string;
        startTime: string;
        endTime: string;
        status: string;
    }>;
}

// API functions
export const bookingApi = {
    // Get calendar data for a venue
    async getCalendarData(venueId: string, startDate: string, endDate: string): Promise<CalendarData> {
        const response = await api.get<ApiResponse<CalendarData>>(
            `/bookings/calendar/${venueId}?startDate=${startDate}&endDate=${endDate}`
        );
        return response.data.data!;
    },

    // Check availability
    async checkAvailability(
        courtId: string,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<AvailabilityResult> {
        const response = await api.get<ApiResponse<AvailabilityResult>>(
            `/bookings/check-availability?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
        );
        return response.data.data!;
    },

    // Calculate price
    async calculatePrice(
        courtId: string,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<PricingResult> {
        const response = await api.get<ApiResponse<PricingResult>>(
            `/bookings/calculate-price?courtId=${courtId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
        );
        return response.data.data!;
    },

    // Create booking
    async create(input: CreateBookingInput): Promise<{ booking: Booking; pricing: PricingResult }> {
        const response = await api.post<ApiResponse<{ booking: Booking; pricing: PricingResult }>>(
            '/bookings',
            input
        );
        return response.data.data!;
    },

    // Update booking
    async update(id: string, input: Partial<CreateBookingInput>): Promise<Booking> {
        const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}`, input);
        return response.data.data!;
    },

    // Cancel booking
    async cancel(id: string, reason?: string): Promise<Booking> {
        const response = await api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason });
        return response.data.data!;
    },

    // Check-in
    async checkIn(id: string): Promise<Booking> {
        const response = await api.post<ApiResponse<Booking>>(`/bookings/${id}/check-in`);
        return response.data.data!;
    },

    // Check-out
    async checkOut(id: string): Promise<Booking> {
        const response = await api.post<ApiResponse<Booking>>(`/bookings/${id}/check-out`);
        return response.data.data!;
    },

    // Get single booking
    async getById(id: string): Promise<Booking> {
        const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
        return response.data.data!;
    },
};

export default bookingApi;
