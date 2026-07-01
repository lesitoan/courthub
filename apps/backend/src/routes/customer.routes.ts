import { Router, Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get all customers (paginated)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, membershipTier, isActive, page, limit } = req.query;

        const result = await customerService.findAll({
            search: search as string,
            membershipTier: membershipTier as string,
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

// Get top customers
router.get('/top', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit } = req.query;
        const customers = await customerService.getTopCustomers(
            limit ? parseInt(limit as string) : undefined
        );
        res.json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
});

// Search by phone (quick lookup)
router.get('/phone/:phone', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.findByPhone(req.params.phone);
        res.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
});

// Get customer by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.findById(req.params.id);
        res.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
});

// Create customer
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo khách hàng thành công',
            data: customer,
        });
    } catch (error) {
        next(error);
    }
});

// Update customer
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.update(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Cập nhật khách hàng thành công',
            data: customer,
        });
    } catch (error) {
        next(error);
    }
});

// Delete customer
router.delete(
    '/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await customerService.delete(req.params.id);
            res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Add points
router.post(
    '/:id/points',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { points, reason } = req.body;
            const customer = await customerService.addPoints(req.params.id, points, reason);
            res.json({
                success: true,
                message: `Đã ${points > 0 ? 'cộng' : 'trừ'} ${Math.abs(points)} điểm`,
                data: customer,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Assign membership
router.post(
    '/:id/membership',
    authenticate,
    authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tier, startDate, endDate } = req.body;
            const customer = await customerService.assignMembership(
                req.params.id,
                tier,
                new Date(startDate),
                new Date(endDate)
            );
            res.json({
                success: true,
                message: 'Đã cập nhật gói membership',
                data: customer,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
