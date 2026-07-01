import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { serviceService } from '../services/service.service.js';

const router = Router();

// Validation schemas
const createServiceSchema = z.object({
    venueId: z.string().min(1, 'Vui lòng chọn cơ sở'),
    name: z.string().min(1, 'Vui lòng nhập tên dịch vụ'),
    description: z.string().optional(),
    price: z.number().min(0, 'Giá phải >= 0'),
    unit: z.string().optional(),
});

const updateServiceSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    unit: z.string().optional(),
    isActive: z.boolean().optional(),
});

// GET /services - List all services
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId, isActive, search, page, limit } = req.query;
        const result = await serviceService.findAll({
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

// GET /services/:id - Get service by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await serviceService.findById(req.params.id);
        res.json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
});

// POST /services - Create service
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = createServiceSchema.parse(req.body);
        const service = await serviceService.create(validated);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
});

// PUT /services/:id - Update service
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = updateServiceSchema.parse(req.body);
        const service = await serviceService.update(req.params.id, validated);
        res.json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
});

// DELETE /services/:id - Delete service
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await serviceService.delete(req.params.id);
        res.json({ success: true, message: 'Đã xóa dịch vụ' });
    } catch (error) {
        next(error);
    }
});

export default router;
