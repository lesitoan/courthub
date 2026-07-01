import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';
import { addDays, addWeeks, format, startOfDay, isBefore, isAfter } from 'date-fns';
import crypto from 'crypto';

export interface RecurringBookingInput {
    courtId: string;
    customerId?: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    totalAmount: number;
    notes?: string;
    createdById: string;
}

export interface RecurringBookingResult {
    recurringGroupId: string;
    totalBookings: number;
    successfulBookings: number;
    skippedDates: string[];
    createdBookings: {
        id: string;
        date: Date;
        startTime: string;
        endTime: string;
    }[];
}

export class RecurringBookingService {
    async createRecurringBookings(input: RecurringBookingInput): Promise<RecurringBookingResult> {
        const { courtId, customerId, startDate, endDate, startTime, endTime, daysOfWeek, totalAmount, notes, createdById } = input;

        // Validate court exists
        const court = await prisma.court.findUnique({ where: { id: courtId } });
        if (!court) {
            throw new AppError(404, 'Không tìm thấy sân');
        }

        // Generate recurring group ID
        const recurringGroupId = crypto.randomUUID();

        // Generate all dates between startDate and endDate that match daysOfWeek
        const dates: Date[] = [];
        let currentDate = startOfDay(new Date(startDate));
        const end = startOfDay(new Date(endDate));

        while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
            const dayOfWeek = currentDate.getDay();
            if (daysOfWeek.includes(dayOfWeek)) {
                dates.push(new Date(currentDate));
            }
            currentDate = addDays(currentDate, 1);
        }

        if (dates.length === 0) {
            throw new AppError(400, 'Không có ngày nào phù hợp với lịch đặt định kỳ');
        }

        // Check for conflicts
        const skippedDates: string[] = [];
        const validDates: Date[] = [];

        for (const date of dates) {
            const conflicts = await prisma.booking.findMany({
                where: {
                    courtId,
                    date,
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                    OR: [
                        { AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] },
                        { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
                        { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] },
                    ],
                },
            });

            if (conflicts.length > 0) {
                skippedDates.push(format(date, 'dd/MM/yyyy'));
            } else {
                validDates.push(date);
            }
        }

        // Create bookings
        const createdBookings: RecurringBookingResult['createdBookings'] = [];

        for (const date of validDates) {
            const booking = await prisma.booking.create({
                data: {
                    courtId,
                    customerId,
                    date,
                    startTime,
                    endTime,
                    status: 'CONFIRMED',
                    totalAmount,
                    notes,
                    isRecurring: true,
                    recurringGroup: recurringGroupId,
                    createdById,
                },
            });

            createdBookings.push({
                id: booking.id,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
            });
        }

        return {
            recurringGroupId,
            totalBookings: dates.length,
            successfulBookings: createdBookings.length,
            skippedDates,
            createdBookings,
        };
    }

    async getRecurringGroup(recurringGroupId: string) {
        const bookings = await prisma.booking.findMany({
            where: { recurringGroup: recurringGroupId },
            include: {
                court: { select: { name: true } },
                customer: { select: { name: true, phone: true } },
            },
            orderBy: { date: 'asc' },
        });

        if (bookings.length === 0) {
            throw new AppError(404, 'Không tìm thấy lịch đặt định kỳ');
        }

        return {
            recurringGroupId,
            totalBookings: bookings.length,
            bookings,
        };
    }

    async cancelRecurringGroup(recurringGroupId: string, cancelFutureOnly = true) {
        const where: { recurringGroup: string; date?: { gte: Date }; status?: { notIn: string[] } } = {
            recurringGroup: recurringGroupId,
            status: { notIn: ['COMPLETED', 'IN_PROGRESS', 'CANCELLED'] },
        };

        if (cancelFutureOnly) {
            where.date = { gte: startOfDay(new Date()) };
        }

        const result = await prisma.booking.updateMany({
            where,
            data: { status: 'CANCELLED' },
        });

        return {
            cancelledCount: result.count,
        };
    }

    async updateRecurringBookingTime(
        recurringGroupId: string,
        newStartTime: string,
        newEndTime: string,
        updateFutureOnly = true
    ) {
        const where: { recurringGroup: string; date?: { gte: Date }; status?: { notIn: string[] } } = {
            recurringGroup: recurringGroupId,
            status: { notIn: ['COMPLETED', 'IN_PROGRESS', 'CANCELLED'] },
        };

        if (updateFutureOnly) {
            where.date = { gte: startOfDay(new Date()) };
        }

        // Get bookings to update
        const bookingsToUpdate = await prisma.booking.findMany({ where });

        // Check for conflicts for each booking
        const updatedBookings: string[] = [];
        const skippedBookings: string[] = [];

        for (const booking of bookingsToUpdate) {
            const conflicts = await prisma.booking.findMany({
                where: {
                    id: { not: booking.id },
                    courtId: booking.courtId,
                    date: booking.date,
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                    OR: [
                        { AND: [{ startTime: { lte: newStartTime } }, { endTime: { gt: newStartTime } }] },
                        { AND: [{ startTime: { lt: newEndTime } }, { endTime: { gte: newEndTime } }] },
                        { AND: [{ startTime: { gte: newStartTime } }, { endTime: { lte: newEndTime } }] },
                    ],
                },
            });

            if (conflicts.length === 0) {
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: { startTime: newStartTime, endTime: newEndTime },
                });
                updatedBookings.push(booking.id);
            } else {
                skippedBookings.push(booking.id);
            }
        }

        return {
            updatedCount: updatedBookings.length,
            skippedCount: skippedBookings.length,
        };
    }

    async getUpcomingRecurringBookings(customerId?: string, limit = 20) {
        const where: { isRecurring: boolean; date: { gte: Date }; status: { notIn: string[] }; customerId?: string } = {
            isRecurring: true,
            date: { gte: startOfDay(new Date()) },
            status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        };

        if (customerId) {
            where.customerId = customerId;
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                court: { select: { name: true } },
                customer: { select: { name: true, phone: true } },
            },
            orderBy: { date: 'asc' },
            take: limit,
        });

        // Group by recurring group
        const groups = new Map<string, typeof bookings>();
        for (const booking of bookings) {
            if (booking.recurringGroup) {
                const existing = groups.get(booking.recurringGroup) || [];
                existing.push(booking);
                groups.set(booking.recurringGroup, existing);
            }
        }

        return Array.from(groups.entries()).map(([groupId, groupBookings]) => ({
            recurringGroupId: groupId,
            court: groupBookings[0].court,
            customer: groupBookings[0].customer,
            startTime: groupBookings[0].startTime,
            endTime: groupBookings[0].endTime,
            upcomingCount: groupBookings.length,
            nextDate: groupBookings[0].date,
            bookings: groupBookings,
        }));
    }
}

export const recurringBookingService = new RecurringBookingService();
