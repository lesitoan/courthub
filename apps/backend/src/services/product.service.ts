import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';

export interface ProductQueryParams {
    venueId?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreateProductInput {
    venueId: string;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    unit?: string;
}

export interface UpdateProductInput {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    unit?: string;
    isActive?: boolean;
}

export class ProductService {
    async findAll(params: ProductQueryParams) {
        const { venueId, isActive, search, page = 1, limit = 20 } = params;

        const where: {
            venueId?: string;
            isActive?: boolean;
            name?: { contains: string; mode: 'insensitive' };
        } = {};

        if (venueId) where.venueId = venueId;
        if (isActive !== undefined) where.isActive = isActive;
        if (search) where.name = { contains: search, mode: 'insensitive' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
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
            prisma.product.count({ where }),
        ]);

        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!product) {
            throw new AppError(404, 'Không tìm thấy sản phẩm');
        }

        return product;
    }

    async create(input: CreateProductInput) {
        // Verify venue exists
        const venue = await prisma.venue.findUnique({
            where: { id: input.venueId },
        });

        if (!venue) {
            throw new AppError(404, 'Không tìm thấy cơ sở');
        }

        const product = await prisma.product.create({
            data: {
                venueId: input.venueId,
                name: input.name,
                description: input.description,
                price: input.price,
                stock: input.stock || 0,
                unit: input.unit || 'cái',
            },
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        return product;
    }

    async update(id: string, input: UpdateProductInput) {
        const existing = await prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy sản phẩm');
        }

        const product = await prisma.product.update({
            where: { id },
            data: input,
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
        });

        return product;
    }

    async updateStock(id: string, quantity: number, type: 'add' | 'subtract') {
        const existing = await prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy sản phẩm');
        }

        const newStock = type === 'add'
            ? existing.stock + quantity
            : existing.stock - quantity;

        if (newStock < 0) {
            throw new AppError(400, 'Không đủ hàng trong kho');
        }

        const product = await prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });

        return product;
    }

    async delete(id: string) {
        const existing = await prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new AppError(404, 'Không tìm thấy sản phẩm');
        }

        // Soft delete - just mark as inactive
        await prisma.product.update({
            where: { id },
            data: { isActive: false },
        });

        return { success: true };
    }

    async getLowStock(venueId?: string, threshold = 10) {
        const where: { stock?: { lte: number }; isActive?: boolean; venueId?: string } = {
            stock: { lte: threshold },
            isActive: true,
        };

        if (venueId) where.venueId = venueId;

        const products = await prisma.product.findMany({
            where,
            include: {
                venue: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { stock: 'asc' },
        });

        return products;
    }
}

export const productService = new ProductService();
