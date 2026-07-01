import { Router, Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get calendar data (optimized for calendar view)
router.get('/calendar/:venueId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Cần cung cấp startDate và endDate',
            });
        }

        const result = await bookingService.getCalendarData(
            req.params.venueId,
            new Date(startDate as string),
            new Date(endDate as string)
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Check availability
router.get('/check-availability', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courtId, date, startTime, endTime, excludeId } = req.query;

        if (!courtId || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc',
            });
        }

        const result = await bookingService.checkAvailability(
            courtId as string,
            new Date(date as string),
            startTime as string,
            endTime as string,
            excludeId as string
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Calculate price
router.get('/calculate-price', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courtId, date, startTime, endTime } = req.query;

        if (!courtId || !date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc',
            });
        }

        const result = await bookingService.calculatePrice(
            courtId as string,
            new Date(date as string),
            startTime as string,
            endTime as string
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Get all bookings (paginated with filters)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courtId, customerId, venueId, date, startDate, endDate, status, page, limit } = req.query;

        const result = await bookingService.findAll({
            courtId: courtId as string,
            customerId: customerId as string,
            venueId: venueId as string,
            date: date ? new Date(date as string) : undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            status: status as string,
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

// Get booking by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await bookingService.findById(req.params.id);
        res.json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

// Create booking
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = {
            ...req.body,
            date: new Date(req.body.date),
            createdById: req.user?.userId,
        };

        const result = await bookingService.create(input);

        res.status(201).json({
            success: true,
            message: 'Đặt sân thành công',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

// Update booking
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await bookingService.update(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Cập nhật lịch đặt thành công',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

// Cancel booking
router.post('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reason } = req.body;
        const booking = await bookingService.cancel(req.params.id, reason);
        res.json({
            success: true,
            message: 'Đã hủy lịch đặt',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

// Check-in
router.post('/:id/check-in', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await bookingService.checkIn(req.params.id);
        res.json({
            success: true,
            message: 'Check-in thành công',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

// Check-out
router.post('/:id/check-out', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await bookingService.checkOut(req.params.id);
        res.json({
            success: true,
            message: 'Check-out thành công',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
