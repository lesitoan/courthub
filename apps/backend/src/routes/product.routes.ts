import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { productService } from '../services/product.service.js';

const router = Router();

// Validation schemas
const createProductSchema = z.object({
    venueId: z.string().min(1, 'Vui lòng chọn cơ sở'),
    name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
    description: z.string().optional(),
    price: z.number().min(0, 'Giá phải >= 0'),
    stock: z.number().int().min(0).optional(),
    unit: z.string().optional(),
});

const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    unit: z.string().optional(),
    isActive: z.boolean().optional(),
});

const updateStockSchema = z.object({
    quantity: z.number().int().positive('Số lượng phải > 0'),
    type: z.enum(['add', 'subtract']),
});

// GET /products - List all products
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId, isActive, search, page, limit } = req.query;
        const result = await productService.findAll({
            venueId: venueId as string,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            search: search as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
        });
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
});

// GET /products/low-stock - Get low stock products
router.get('/low-stock', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId, threshold } = req.query;
        const products = await productService.getLowStock(
            venueId as string,
            threshold ? parseInt(threshold as string) : 10
        );
        res.json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
});

// GET /products/:id - Get product by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.findById(req.params.id);
        res.json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
});

// POST /products - Create product
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = createProductSchema.parse(req.body);
        const product = await productService.create(validated);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
});

// PUT /products/:id - Update product
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = updateProductSchema.parse(req.body);
        const product = await productService.update(req.params.id, validated);
        res.json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
});

// PATCH /products/:id/stock - Update stock
router.patch('/:id/stock', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = updateStockSchema.parse(req.body);
        const product = await productService.updateStock(
            req.params.id,
            validated.quantity,
            validated.type
        );
        res.json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
});

// DELETE /products/:id - Delete product
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.delete(req.params.id);
        res.json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error) {
        next(error);
    }
});

export default router;
