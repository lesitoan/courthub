import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';

export interface ServiceQueryParams {
    venueId?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreateServiceInput {
    venueId: string;
    name: string;
    description?: string;
    price: number;
    unit?: string;
}

export interface UpdateServiceInput {
    name?: string;
    description?: string;
    price?: number;
    unit?: string;
    isActive?: boolean;
}

export class ServiceService {
    async findAll(params: ServiceQueryParams) {
        const { venueId, isActive, search, page = 1, limit = 20 } = params;

        const where: {
            venueId?: string;
            isActive?: boolean;
            name?: { contains: string; mode: 'insensitive' };
        } = {};

        if (venueId) where.venueId = venueId;
        if (isActive !== undefined) where.isActive = isActive;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const [services, total] = await Promise.all([
            prisma.service.findMany({
                where,
                include: {
                    venue: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { name: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.service.count({ where }),
        ]);

        return {
            data: services,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!service) {
            throw new AppError(404, 'Không tìm thấy dịch vụ');
        }

        return service;
    }

    async create(input: CreateServiceInput) {
        // Verify venue exists
        const venue = await prisma.venue.findUnique({
            where: { id: input.venueId },
        });

        if (!venue) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        const service = await prisma.service.create({
            data: {
                venueId: input.venueId,
                name: input.name,
                description: input.description,
                price: input.price,
                unit: input.unit || 'lần',
            },
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        return service;
    }

    async update(id: string, input: UpdateServiceInput) {
        const existing = await prisma.service.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy dịch vụ');
        }

        const service = await prisma.service.update({
            where: { id },
            data: input,
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        return service;
    }

    async delete(id: string) {
        const existing = await prisma.service.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy dịch vụ');
        }

        // Soft delete - just mark as inactive
        await prisma.service.update({
            where: { id },
            data: { isActive: false },
        });

        return { success: true };
    }
}

export const serviceService = new ServiceService();
