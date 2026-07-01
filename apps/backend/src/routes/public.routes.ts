import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { publicBookingService } from '../services/public-booking.service.js';

const router = Router();

const addonSchema = z.object({
    type: z.enum(['product', 'service']),
    id: z.string().min(1),
    quantity: z.number().int().positive(),
});

const createBookingSchema = z.object({
    venueId: z.string().min(1),
    courtId: z.string().min(1),
    date: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    customerName: z.string().min(1),
    customerPhone: z.string().min(9),
    customerEmail: z.string().email().optional().or(z.literal('')),
    notes: z.string().optional(),
    addons: z.array(addonSchema).optional(),
});

const rescheduleSchema = z.object({
    phone: z.string().min(9),
    courtId: z.string().optional(),
    date: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    reason: z.string().optional(),
});

const cancelSchema = z.object({
    phone: z.string().min(9),
    reason: z.string().optional(),
});

router.get('/venues', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const venues = await publicBookingService.getVenues();
        res.json({ success: true, data: venues });
    } catch (error) {
        next(error);
    }
});

router.get('/venues/:venueId/courts', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courts = await publicBookingService.getCourts(req.params.venueId);
        res.json({ success: true, data: courts });
    } catch (error) {
        next(error);
    }
});

router.get('/venues/:venueId/addons', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addons = await publicBookingService.getAddons(req.params.venueId);
        res.json({ success: true, data: addons });
    } catch (error) {
        next(error);
    }
});

router.get('/courts/:courtId/availability', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = req.query.date as string;
        if (!date) {
            return res.status(400).json({ success: false, message: 'Can cung cap ngay dat san' });
        }
        const result = await publicBookingService.getAvailability(req.params.courtId, date, req.query.excludeId as string | undefined);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

router.post('/bookings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = createBookingSchema.parse(req.body);
        const result = await publicBookingService.createBooking({
            ...input,
            customerEmail: input.customerEmail || undefined,
        });
        res.status(201).json({
            success: true,
            message: 'Dat san thanh cong',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/bookings/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const phone = req.query.phone as string;
        if (!phone) {
            return res.status(400).json({ success: false, message: 'Can nhap so dien thoai' });
        }
        const result = await publicBookingService.lookup(phone);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

router.get('/bookings/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await publicBookingService.findBooking(req.params.id);
        res.json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
});

router.patch('/bookings/:id/reschedule', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = rescheduleSchema.parse(req.body);
        const booking = await publicBookingService.reschedule(req.params.id, input);
        res.json({ success: true, message: 'Doi lich thanh cong', data: booking });
    } catch (error) {
        next(error);
    }
});

router.post('/bookings/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = cancelSchema.parse(req.body);
        const booking = await publicBookingService.cancel(req.params.id, input.phone, input.reason);
        res.json({ success: true, message: 'Huy lich thanh cong', data: booking });
    } catch (error) {
        next(error);
    }
});

export default router;
