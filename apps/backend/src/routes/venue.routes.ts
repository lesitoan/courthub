import { Router, Request, Response, NextFunction } from 'express';
import { venueService } from '../services/venue.service.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get all venues (paginated)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, isActive, page, limit } = req.query;

        const result = await venueService.findAll({
            search: search as string,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
});

// Get venue by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venue = await venueService.findById(req.params.id);
        res.json({
            success: true,
            data: venue,
        });
    } catch (error) {
        next(error);
    }
});

// Get venue stats
router.get('/:id/stats', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await venueService.getStats(req.params.id);
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Create venue (Admin/Manager only)
router.post(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const venue = await venueService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo cơ sở thành công',
                data: venue,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Update venue (Admin/Manager only)
router.put(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const venue = await venueService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Cập nhật cơ sở thành công',
                data: venue,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Delete venue (Admin only)
router.delete(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await venueService.delete(req.params.id);
            res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
