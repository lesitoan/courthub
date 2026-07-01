import { Router } from 'express';
import authRoutes from './auth.routes.js';
import venueRoutes from './venue.routes.js';
import courtRoutes from './court.routes.js';
import bookingRoutes from './booking.routes.js';
import customerRoutes from './customer.routes.js';
import invoiceRoutes from './invoice.routes.js';
import productRoutes from './product.routes.js';
import serviceRoutes from './service.routes.js';
import reportRoutes from './report.routes.js';
import exportRoutes from './export.routes.js';
import recurringBookingRoutes from './recurring-booking.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Courtify API is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/venues', venueRoutes);
router.use('/courts', courtRoutes);
router.use('/bookings', bookingRoutes);
router.use('/recurring-bookings', recurringBookingRoutes);
router.use('/customers', customerRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/reports', reportRoutes);
router.use('/export', exportRoutes);

export default router;
