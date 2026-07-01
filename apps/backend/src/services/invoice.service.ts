import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';

export interface CreateInvoiceInput {
    customerId?: string;
    bookingIds?: string[];
    productItems?: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
    }>;
    serviceItems?: Array<{
        serviceId: string;
        quantity: number;
        unitPrice: number;
    }>;
    discount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    paymentMethod?: string;
    notes?: string;
}

export interface InvoiceQueryParams {
    customerId?: string;
    paymentStatus?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
}

export class InvoiceService {
    async findAll(params: InvoiceQueryParams) {
        const { customerId, paymentStatus, startDate, endDate, page = 1, limit = 20 } = params;
        const skip = (page - 1) * limit;

        interface WhereClause {
            customerId?: string;
            paymentStatus?: string;
            createdAt?: {
                gte?: Date;
                lte?: Date;
            };
        }

        const where: WhereClause = {};

        if (customerId) where.customerId = customerId;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const [invoices, total] = await Promise.all([
            prisma.invoice.findMany({
                where,
                include: {
                    customer: {
                        select: { id: true, name: true, phone: true, membershipTier: true },
                    },
                    items: {
                        include: {
                            booking: { select: { id: true, startTime: true, endTime: true, date: true } },
                            product: { select: { id: true, name: true } },
                            service: { select: { id: true, name: true } },
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.invoice.count({ where }),
        ]);

        return {
            data: invoices,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById(id: string) {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        booking: {
                            include: { court: { select: { name: true } } },
                        },
                        product: true,
                        service: true,
                    },
                },
            },
        });

        if (!invoice) {
            throw new AppError(404, 'Khong tim thay hoa don');
        }

        return invoice;
    }

    async create(input: CreateInvoiceInput) {
        const { customerId, bookingIds, productItems, serviceItems, discount, discountType, paymentMethod, notes } = input;

        // Calculate subtotal
        let subtotal = 0;
        const items: Array<{
            description: string;
            quantity: number;
            unitPrice: number;
            total: number;
            bookingId?: string;
            productId?: string;
            serviceId?: string;
        }> = [];

        // Add booking items
        if (bookingIds && bookingIds.length > 0) {
            const bookings = await prisma.booking.findMany({
                where: { id: { in: bookingIds } },
                include: { court: { select: { name: true } } },
            });

            for (const booking of bookings) {
                const amount = booking.totalAmount;
                subtotal += amount;
                items.push({
                    description: `${booking.court.name} - ${booking.startTime} den ${booking.endTime}`,
                    quantity: 1,
                    unitPrice: amount,
                    total: amount,
                    bookingId: booking.id,
                });
            }
        }

        // Add product items
        if (productItems && productItems.length > 0) {
            for (const item of productItems) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (!product) continue;

                const amount = item.quantity * item.unitPrice;
                subtotal += amount;
                items.push({
                    description: product.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: amount,
                    productId: item.productId,
                });

                // Update stock
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
        }

        // Add service items
        if (serviceItems && serviceItems.length > 0) {
            for (const item of serviceItems) {
                const service = await prisma.service.findUnique({ where: { id: item.serviceId } });
                if (!service) continue;

                const amount = item.quantity * item.unitPrice;
                subtotal += amount;
                items.push({
                    description: service.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    total: amount,
                    serviceId: item.serviceId,
                });
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (discount && discount > 0) {
            if (discountType === 'PERCENTAGE') {
                discountAmount = subtotal * (discount / 100);
            } else {
                discountAmount = discount;
            }
        }

        const total = subtotal - discountAmount;

        // Generate invoice number
        const today = new Date();
        const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await prisma.invoice.count({
            where: {
                createdAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                },
            },
        });
        const invoiceNumber = `INV${datePrefix}${String(count + 1).padStart(4, '0')}`;

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                customerId,
                subtotal,
                discount: discountAmount,
                total,
                paymentStatus: 'PENDING',
                paymentMethod,
                notes,
                items: {
                    create: items,
                },
            },
            include: {
                items: true,
                customer: { select: { name: true, phone: true } },
            },
        });

        // Mark bookings as invoiced
        if (bookingIds && bookingIds.length > 0) {
            await prisma.booking.updateMany({
                where: { id: { in: bookingIds } },
                data: { status: 'COMPLETED' },
            });
        }

        return invoice;
    }

    async updatePaymentStatus(id: string, paymentStatus: string, paidAmount?: number) {
        const existing = await prisma.invoice.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, 'Khong tim thay hoa don');
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                paymentStatus,
                paidAmount: paidAmount !== undefined ? paidAmount : (paymentStatus === 'PAID' ? existing.total : existing.paidAmount),
                ...(paymentStatus === 'PAID' ? { paidAt: new Date() } : {}),
            },
            include: {
                customer: { select: { id: true, name: true } },
            },
        });

        // Update customer total spent if paid
        if (paymentStatus === 'PAID' && invoice.customerId) {
            await prisma.customer.update({
                where: { id: invoice.customerId },
                data: { totalSpent: { increment: invoice.total } },
            });
        }

        return invoice;
    }

    async cancel(id: string, reason?: string) {
        const existing = await prisma.invoice.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, 'Khong tim thay hoa don');
        }

        if (existing.paymentStatus === 'PAID') {
            throw new AppError(400, 'Khong the huy hoa don da thanh toan');
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                paymentStatus: 'REFUNDED',
                notes: reason ? `${existing.notes || ''}\n[Huy]: ${reason}` : existing.notes,
            },
        });

        return invoice;
    }

    // Get daily revenue summary  
    async getDailySummary(date: Date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const invoices = await prisma.invoice.findMany({
            where: {
                paymentStatus: 'PAID',
                paidAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                items: true,
            },
        });

        let totalRevenue = 0;

        for (const invoice of invoices) {
            totalRevenue += invoice.total;
        }

        return {
            date: date.toISOString().split('T')[0],
            invoiceCount: invoices.length,
            totalRevenue,
        };
    }
}

export const invoiceService = new InvoiceService();
