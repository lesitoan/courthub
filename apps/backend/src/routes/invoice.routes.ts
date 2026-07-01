import { Router } from 'express';
import { invoiceService, CreateInvoiceInput } from '../services/invoice.service.js';
import { authenticate } from '../middleware/auth.js';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// List invoices
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId, paymentStatus, startDate, endDate, page, limit } = req.query;
        const result = await invoiceService.findAll({
            customerId: customerId as string,
            paymentStatus: paymentStatus as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
        });
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
});

// Get daily summary - must be before /:id route
router.get('/summary/daily', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;
        const summary = await invoiceService.getDailySummary(
            date ? new Date(date as string) : new Date()
        );
        res.json({ success: true, data: summary });
    } catch (error) {
        next(error);
    }
});

// Get invoice by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await invoiceService.findById(req.params.id);
        res.json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
});

// Create invoice
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input: CreateInvoiceInput = req.body;
        const invoice = await invoiceService.create(input);
        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
});

// Update invoice payment status
router.patch('/:id/status', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paymentStatus, paidAmount } = req.body;
        const invoice = await invoiceService.updatePaymentStatus(req.params.id, paymentStatus, paidAmount);
        res.json({ success: true, data: invoice });
    } catch (error) {
        next(error);
    }
});

// Mark as paid
router.post('/:id/pay', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoice = await invoiceService.updatePaymentStatus(req.params.id, 'PAID');
        res.json({ success: true, data: invoice, message: 'Thanh toan thanh cong' });
    } catch (error) {
        next(error);
    }
});

// Cancel invoice
router.post('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reason } = req.body;
        const invoice = await invoiceService.cancel(req.params.id, reason);
        res.json({ success: true, data: invoice, message: 'Da huy hoa don' });
    } catch (error) {
        next(error);
    }
});

export default router;
