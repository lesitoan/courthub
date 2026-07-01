import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.js';
import { reportService } from '../services/report.service.js';

const router = Router();

// GET /reports/dashboard - Get dashboard stats
router.get('/dashboard', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await reportService.getDashboardStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
});

// GET /reports/revenue-chart - Get revenue chart data
router.get('/revenue-chart', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const days = req.query.days ? parseInt(req.query.days as string) : 7;
        const data = await reportService.getRevenueChart(days);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /reports/monthly-revenue - Get monthly revenue comparison
router.get('/monthly-revenue', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await reportService.getMonthlyRevenue();
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /reports/top-customers - Get top customers by spending
router.get('/top-customers', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const customers = await reportService.getTopCustomers(limit);
        res.json({ success: true, data: customers });
    } catch (error) {
        next(error);
    }
});

// GET /reports/booking-status - Get booking status summary
router.get('/booking-status', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId } = req.query;
        const data = await reportService.getBookingStatusSummary(venueId as string);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /reports/upcoming-bookings - Get upcoming bookings
router.get('/upcoming-bookings', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
        const bookings = await reportService.getUpcomingBookings(limit);
        res.json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
});

export default router;
