import prisma from '../config/database.js';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, format } from 'date-fns';

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

export class ReportService {
    async getDashboardStats(): Promise<DashboardStats> {
        const today = new Date();
        const startOfToday = startOfDay(today);
        const endOfToday = endOfDay(today);

        // Get current hour for court availability
        const currentHour = today.getHours();
        const currentTime = `${String(currentHour).padStart(2, '0')}:00`;

        // Count paid invoices for today
        const todayInvoices = await prisma.invoice.aggregate({
            where: {
                paymentStatus: 'PAID',
                paidAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            _sum: { total: true },
        });

        // Count today's bookings
        const todayBookings = await prisma.booking.count({
            where: {
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: { not: 'CANCELLED' },
            },
        });

        // Count active customers
        const activeCustomers = await prisma.customer.count({
            where: { isActive: true },
        });

        // Count total active courts and courts currently in use
        const totalCourts = await prisma.court.count({
            where: { status: 'AVAILABLE' },
        });

        // Courts in use right now
        const courtsInUse = await prisma.booking.count({
            where: {
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: 'IN_PROGRESS',
                startTime: { lte: currentTime },
                endTime: { gt: currentTime },
            },
        });

        // Pending invoices
        const pendingInvoices = await prisma.invoice.count({
            where: { paymentStatus: 'PENDING' },
        });

        return {
            todayRevenue: todayInvoices._sum.total || 0,
            todayBookings,
            activeCustomers,
            courtsAvailable: totalCourts - courtsInUse,
            courtsInUse,
            pendingInvoices,
        };
    }

    async getRevenueChart(days = 7): Promise<RevenueChartData[]> {
        const result: RevenueChartData[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(today, i);
            const start = startOfDay(date);
            const end = endOfDay(date);

            const [revenue, bookingCount] = await Promise.all([
                prisma.invoice.aggregate({
                    where: {
                        paymentStatus: 'PAID',
                        paidAt: {
                            gte: start,
                            lte: end,
                        },
                    },
                    _sum: { total: true },
                }),
                prisma.booking.count({
                    where: {
                        date: { gte: start, lte: end },
                        status: { not: 'CANCELLED' },
                    },
                }),
            ]);

            result.push({
                date: format(date, 'dd/MM'),
                revenue: revenue._sum.total || 0,
                bookings: bookingCount,
            });
        }

        return result;
    }

    async getMonthlyRevenue(): Promise<{ currentMonth: number; lastMonth: number; growth: number }> {
        const today = new Date();
        const startCurrent = startOfMonth(today);
        const endCurrent = endOfMonth(today);

        const lastMonthDate = subDays(startCurrent, 1);
        const startLast = startOfMonth(lastMonthDate);
        const endLast = endOfMonth(lastMonthDate);

        const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
            prisma.invoice.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    paidAt: {
                        gte: startCurrent,
                        lte: endCurrent,
                    },
                },
                _sum: { total: true },
            }),
            prisma.invoice.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    paidAt: {
                        gte: startLast,
                        lte: endLast,
                    },
                },
                _sum: { total: true },
            }),
        ]);

        const current = currentMonthRevenue._sum.total || 0;
        const last = lastMonthRevenue._sum.total || 0;
        const growth = last > 0 ? ((current - last) / last) * 100 : 0;

        return {
            currentMonth: current,
            lastMonth: last,
            growth: Math.round(growth * 10) / 10,
        };
    }

    async getTopCustomers(limit = 10): Promise<TopCustomer[]> {
        const customers = await prisma.customer.findMany({
            where: { isActive: true },
            orderBy: { totalSpent: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                phone: true,
                membershipTier: true,
                totalSpent: true,
                totalBookings: true,
            },
        });

        return customers.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            membershipTier: c.membershipTier || undefined,
            totalSpent: c.totalSpent,
            totalBookings: c.totalBookings,
        }));
    }

    async getBookingStatusSummary(venueId?: string): Promise<BookingStatusSummary[]> {
        const today = startOfDay(new Date());

        const where: { date?: { gte: Date }; court?: { venueId: string } } = {
            date: { gte: today },
        };

        if (venueId) {
            where.court = { venueId };
        }

        const bookings = await prisma.booking.groupBy({
            by: ['status'],
            where,
            _count: { id: true },
        });

        return bookings.map(b => ({
            status: b.status,
            count: b._count.id,
        }));
    }

    async getUpcomingBookings(limit = 5): Promise<{
        id: string;
        courtName: string;
        customerName: string;
        date: Date;
        startTime: string;
        endTime: string;
        status: string;
    }[]> {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const bookings = await prisma.booking.findMany({
            where: {
                date: { gte: startOfDay(now) },
                status: { in: ['CONFIRMED', 'PENDING'] },
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' },
            ],
            take: limit,
            include: {
                court: { select: { name: true } },
                customer: { select: { name: true } },
            },
        });

        return bookings.map(b => ({
            id: b.id,
            courtName: b.court.name,
            customerName: b.customer?.name || 'Khách vãng lai',
            date: b.date,
            startTime: b.startTime,
            endTime: b.endTime,
            status: b.status,
        }));
    }
}

export const reportService = new ReportService();
