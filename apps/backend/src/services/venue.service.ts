import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';

export interface CreateVenueInput {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    description?: string;
    logo?: string;
    openTime?: string;
    closeTime?: string;
}

export interface UpdateVenueInput extends Partial<CreateVenueInput> {
    isActive?: boolean;
}

export interface VenueQueryParams {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export class VenueService {
    async findAll(params: VenueQueryParams) {
        const { search, isActive, page = 1, limit = 20 } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { address: { contains: search } },
                { phone: { contains: search } },
            ];
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [venues, total] = await Promise.all([
            prisma.venue.findMany({
                where,
                include: {
                    _count: {
                        select: { courts: true, staff: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            prisma.venue.count({ where }),
        ]);

        return {
            data: venues,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                courts: {
                    orderBy: { sortOrder: 'asc' },
                },
                pricingRules: {
                    where: { isActive: true },
                    orderBy: { priority: 'desc' },
                },
                services: {
                    where: { isActive: true },
                },
                products: {
                    where: { isActive: true },
                },
                _count: {
                    select: { courts: true, staff: true },
                },
            },
        });

        if (!venue) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        return venue;
    }

    async create(input: CreateVenueInput) {
        const venue = await prisma.venue.create({
            data: {
                name: input.name,
                address: input.address,
                phone: input.phone,
                email: input.email,
                description: input.description,
                logo: input.logo,
                openTime: input.openTime || '06:00',
                closeTime: input.closeTime || '23:00',
            },
        });

        return venue;
    }

    async update(id: string, input: UpdateVenueInput) {
        // Check if venue exists
        const existing = await prisma.venue.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        const venue = await prisma.venue.update({
            where: { id },
            data: input,
        });

        return venue;
    }

    async delete(id: string) {
        // Check if venue exists
        const existing = await prisma.venue.findUnique({
            where: { id },
            include: { _count: { select: { courts: true } } },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        // Check for active courts with bookings
        if (existing._count.courts > 0) {
            // Soft delete instead
            await prisma.venue.update({
                where: { id },
                data: { isActive: false },
            });
            return { message: 'Cơ sở đã được vô hiệu hóa (có sân đang liên kết)' };
        }

        await prisma.venue.delete({ where: { id } });
        return { message: 'Đã xóa cơ sở thành công' };
    }

    async getStats(id: string) {
        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                courts: true,
                _count: {
                    select: {
                        courts: true,
                        staff: true,
                    },
                },
            },
        });

        if (!venue) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        // Get today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const courtIds = venue.courts.map((c: { id: string }) => c.id);

        const [todayBookings, totalBookings] = await Promise.all([
            prisma.booking.count({
                where: {
                    courtId: { in: courtIds },
                    date: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            prisma.booking.count({
                where: {
                    courtId: { in: courtIds },
                },
            }),
        ]);

        return {
            venue,
            stats: {
                totalCourts: venue._count.courts,
                totalStaff: venue._count.staff,
                todayBookings,
                totalBookings,
            },
        };
    }
}

export const venueService = new VenueService();
