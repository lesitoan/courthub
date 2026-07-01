import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { recurringBookingService } from '../services/recurring-booking.service.js';

const router = Router();

// Validation schemas
const createRecurringSchema = z.object({
    courtId: z.string(),
    customerId: z.string().optional(),
    startDate: z.string().transform(s => new Date(s)),
    endDate: z.string().transform(s => new Date(s)),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    daysOfWeek: z.array(z.number().min(0).max(6)),
    totalAmount: z.number().min(0),
    notes: z.string().optional(),
});

const updateTimeSchema = z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    updateFutureOnly: z.boolean().optional().default(true),
});

// POST /recurring-bookings - Create recurring bookings
router.post('/', authenticate, authorize('ADMIN', 'MANAGER', 'STAFF'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createRecurringSchema.parse(req.body);
        const result = await recurringBookingService.createRecurringBookings({
            ...data,
            createdById: req.user!.userId,
        });

        res.status(201).json({
            success: true,
            message: `Đã tạo ${result.successfulBookings}/${result.totalBookings} lịch đặt định kỳ`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// GET /recurring-bookings - Get upcoming recurring bookings
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId, limit } = req.query;
        const result = await recurringBookingService.getUpcomingRecurringBookings(
            customerId as string | undefined,
            limit ? parseInt(limit as string) : 20
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// GET /recurring-bookings/:groupId - Get recurring group details
router.get('/:groupId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await recurringBookingService.getRecurringGroup(req.params.groupId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /recurring-bookings/:groupId/time - Update time for recurring group
router.patch('/:groupId/time', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startTime, endTime, updateFutureOnly } = updateTimeSchema.parse(req.body);
        const result = await recurringBookingService.updateRecurringBookingTime(
            req.params.groupId,
            startTime,
            endTime,
            updateFutureOnly
        );

        res.json({
            success: true,
            message: `Đã cập nhật ${result.updatedCount} lịch đặt`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /recurring-bookings/:groupId - Cancel recurring group
router.delete('/:groupId', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cancelFutureOnly = req.query.futureOnly !== 'false';
        const result = await recurringBookingService.cancelRecurringGroup(req.params.groupId, cancelFutureOnly);

        res.json({
            success: true,
            message: `Đã hủy ${result.cancelledCount} lịch đặt`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
