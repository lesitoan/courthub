import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';

export interface CreateCustomerInput {
    name: string;
    phone: string;
    email?: string;
    dateOfBirth?: Date;
    address?: string;
    notes?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
    membershipTier?: string;
    membershipStart?: Date;
    membershipEnd?: Date;
    isActive?: boolean;
}

export interface CustomerQueryParams {
    search?: string;
    membershipTier?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export class CustomerService {
    async findAll(params: CustomerQueryParams) {
        const { search, membershipTier, isActive, page = 1, limit = 20 } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
            ];
        }

        if (membershipTier) {
            where.membershipTier = membershipTier;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.customer.count({ where }),
        ]);

        return {
            data: customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                bookings: {
                    take: 10,
                    orderBy: { date: 'desc' },
                    include: {
                        court: {
                            select: { name: true, venue: { select: { name: true } } },
                        },
                    },
                },
                invoices: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!customer) {
            throw new AppError(404, 'Không tìm thấy khách hàng');
        }

        return customer;
    }

    async findByPhone(phone: string) {
        const customer = await prisma.customer.findUnique({
            where: { phone },
        });
        return customer;
    }

    async create(input: CreateCustomerInput) {
        // Check if phone already exists
        const existing = await prisma.customer.findUnique({
            where: { phone: input.phone },
        });

        if (existing) {
            throw new AppError(409, 'Số điện thoại đã được sử dụng');
        }

        const customer = await prisma.customer.create({
            data: {
                name: input.name,
                phone: input.phone,
                email: input.email,
                dateOfBirth: input.dateOfBirth,
                address: input.address,
                notes: input.notes,
            },
        });

        return customer;
    }

    async update(id: string, input: UpdateCustomerInput) {
        const existing = await prisma.customer.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, 'Không tìm thấy khách hàng');
        }

        // Check phone uniqueness if updating
        if (input.phone && input.phone !== existing.phone) {
            const phoneExists = await prisma.customer.findUnique({
                where: { phone: input.phone },
            });
            if (phoneExists) {
                throw new AppError(409, 'Số điện thoại đã được sử dụng');
            }
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: input,
        });

        return customer;
    }

    async delete(id: string) {
        const existing = await prisma.customer.findUnique({
            where: { id },
            include: { _count: { select: { bookings: true, invoices: true } } },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy khách hàng');
        }

        // Soft delete if has related data
        if (existing._count.bookings > 0 || existing._count.invoices > 0) {
            await prisma.customer.update({
                where: { id },
                data: { isActive: false },
            });
            return { message: 'Khách hàng đã được vô hiệu hóa' };
        }

        await prisma.customer.delete({ where: { id } });
        return { message: 'Đã xóa khách hàng thành công' };
    }

    async addPoints(id: string, points: number, reason: string) {
        const customer = await prisma.customer.findUnique({ where: { id } });
        if (!customer) {
            throw new AppError(404, 'Không tìm thấy khách hàng');
        }

        const updated = await prisma.customer.update({
            where: { id },
            data: {
                points: customer.points + points,
            },
        });

        // TODO: Log points history

        return updated;
    }

    async assignMembership(id: string, tier: string, startDate: Date, endDate: Date) {
        const customer = await prisma.customer.findUnique({ where: { id } });
        if (!customer) {
            throw new AppError(404, 'Không tìm thấy khách hàng');
        }

        const updated = await prisma.customer.update({
            where: { id },
            data: {
                membershipTier: tier,
                membershipStart: startDate,
                membershipEnd: endDate,
            },
        });

        return updated;
    }

    async getTopCustomers(limit: number = 10) {
        const customers = await prisma.customer.findMany({
            where: { isActive: true },
            orderBy: { totalSpent: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                phone: true,
                membershipTier: true,
                totalBookings: true,
                totalSpent: true,
                points: true,
            },
        });

        return customers;
    }
}

export const customerService = new CustomerService();
