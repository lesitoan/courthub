import { Router, Request, Response, NextFunction } from 'express';
import { courtService } from '../services/court.service.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get courts by venue
router.get('/venue/:venueId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courts = await courtService.findByVenue(req.params.venueId);
        res.json({
            success: true,
            data: courts,
        });
    } catch (error) {
        next(error);
    }
});

// Get court by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const court = await courtService.findById(req.params.id);
        res.json({
            success: true,
            data: court,
        });
    } catch (error) {
        next(error);
    }
});

// Get court availability
router.get('/:id/availability', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date as string) : new Date();

        const result = await courtService.getAvailability(req.params.id, targetDate);
        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Create court
router.post(
    '/',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const court = await courtService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo sân thành công',
                data: court,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Update court
router.put(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const court = await courtService.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Cập nhật sân thành công',
                data: court,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Delete court
router.delete(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await courtService.delete(req.params.id);
            res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Reorder courts
router.post(
    '/reorder/:venueId',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courtIds } = req.body;
            const courts = await courtService.reorder(req.params.venueId, courtIds);
            res.json({
                success: true,
                message: 'Sắp xếp lại sân thành công',
                data: courts,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
