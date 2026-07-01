import api, { ApiResponse } from './api';

export interface DashboardStats {
    todayRevenue: number;
    todayBookings: number;
    activeCustomers: number;
    courtsAvailable: number;
    courtsInUse: number;
    pendingInvoices: number;
}

export interface RevenueChartData {
    date: string;
    revenue: number;
    bookings: number;
}

export interface MonthlyRevenue {
    currentMonth: number;
    lastMonth: number;
    growth: number;
}

export interface TopCustomer {
    id: string;
    name: string;
    phone: string;
    membershipTier?: string;
    totalSpent: number;
    totalBookings: number;
}

export interface BookingStatusSummary {
    status: string;
    count: number;
}

export interface UpcomingBooking {
    id: string;
    courtName: string;
    customerName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
}

export const reportApi = {
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await api.get<ApiResponse<DashboardStats>>('/reports/dashboard');
        return response.data.data!;
    },

    async getRevenueChart(days = 7): Promise<RevenueChartData[]> {
        const response = await api.get<ApiResponse<RevenueChartData[]>>(`/reports/revenue-chart?days=${days}`);
        return response.data.data || [];
    },

    async getMonthlyRevenue(): Promise<MonthlyRevenue> {
        const response = await api.get<ApiResponse<MonthlyRevenue>>('/reports/monthly-revenue');
        return response.data.data!;
    },

    async getTopCustomers(limit = 10): Promise<TopCustomer[]> {
        const response = await api.get<ApiResponse<TopCustomer[]>>(`/reports/top-customers?limit=${limit}`);
        return response.data.data || [];
    },

    async getBookingStatusSummary(venueId?: string): Promise<BookingStatusSummary[]> {
        const queryParams = venueId ? `?venueId=${venueId}` : '';
        const response = await api.get<ApiResponse<BookingStatusSummary[]>>(`/reports/booking-status${queryParams}`);
        return response.data.data || [];
    },

    async getUpcomingBookings(limit = 5): Promise<UpcomingBooking[]> {
        const response = await api.get<ApiResponse<UpcomingBooking[]>>(`/reports/upcoming-bookings?limit=${limit}`);
        return response.data.data || [];
    },
};
