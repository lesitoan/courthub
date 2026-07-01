import api, { ApiResponse } from './api';

export interface RecurringBookingInput {
    courtId: string;
    customerId?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    totalAmount: number;
    notes?: string;
}

export interface RecurringBookingResult {
    recurringGroupId: string;
    totalBookings: number;
    successfulBookings: number;
    skippedDates: string[];
    createdBookings: {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
    }[];
}

export interface RecurringGroup {
    recurringGroupId: string;
    court: { name: string };
    customer: { name: string; phone: string } | null;
    startTime: string;
    endTime: string;
    upcomingCount: number;
    nextDate: string;
    bookings: {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        status: string;
    }[];
}

export interface RecurringGroupDetail {
    recurringGroupId: string;
    totalBookings: number;
    bookings: {
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        status: string;
        court: { name: string };
        customer: { name: string; phone: string } | null;
    }[];
}

export const recurringBookingApi = {
    async create(data: RecurringBookingInput): Promise<ApiResponse<RecurringBookingResult>> {
        const response = await api.post<ApiResponse<RecurringBookingResult>>('/recurring-bookings', data);
        return response.data;
    },

    async getAll(customerId?: string): Promise<RecurringGroup[]> {
        const params = customerId ? `?customerId=${customerId}` : '';
        const response = await api.get<ApiResponse<RecurringGroup[]>>(`/recurring-bookings${params}`);
        return response.data.data || [];
    },

    async getById(groupId: string): Promise<RecurringGroupDetail> {
        const response = await api.get<ApiResponse<RecurringGroupDetail>>(`/recurring-bookings/${groupId}`);
        return response.data.data!;
    },

    async updateTime(groupId: string, startTime: string, endTime: string, updateFutureOnly = true): Promise<ApiResponse<{ updatedCount: number; skippedCount: number }>> {
        const response = await api.patch<ApiResponse<{ updatedCount: number; skippedCount: number }>>(
            `/recurring-bookings/${groupId}/time`,
            { startTime, endTime, updateFutureOnly }
        );
        return response.data;
    },

    async cancel(groupId: string, futureOnly = true): Promise<ApiResponse<{ cancelledCount: number }>> {
        const response = await api.delete<ApiResponse<{ cancelledCount: number }>>(
            `/recurring-bookings/${groupId}?futureOnly=${futureOnly}`
        );
        return response.data;
    },
};
