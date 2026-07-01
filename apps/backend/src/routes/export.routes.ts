import { Router, Request, Response, NextFunction } from 'express';
import * as XLSX from 'xlsx';
import { authenticate, authorize } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

const router = Router();

// GET /export/invoices - Export invoices to Excel
router.get('/invoices', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, status } = req.query;

        const where: {
            createdAt?: { gte?: Date; lte?: Date };
            paymentStatus?: string;
        } = {};

        if (startDate) {
            where.createdAt = where.createdAt || {};
            where.createdAt.gte = startOfDay(new Date(startDate as string));
        }
        if (endDate) {
            where.createdAt = where.createdAt || {};
            where.createdAt.lte = endOfDay(new Date(endDate as string));
        }
        if (status) {
            where.paymentStatus = status as string;
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                customer: { select: { name: true, phone: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Prepare data for Excel
        const data = invoices.map((inv) => ({
            'Số hóa đơn': inv.invoiceNumber,
            'Khách hàng': inv.customer?.name || 'Khách lẻ',
            'SĐT': inv.customer?.phone || '',
            'Tạm tính': inv.subtotal,
            'Giảm giá': inv.discount,
            'Tổng cộng': inv.total,
            'Đã thanh toán': inv.paidAmount,
            'Trạng thái': inv.paymentStatus === 'PAID' ? 'Đã TT' : inv.paymentStatus === 'PARTIAL' ? 'TT một phần' : 'Chưa TT',
            'Ngày tạo': format(new Date(inv.createdAt), 'dd/MM/yyyy HH:mm'),
            'Ngày thanh toán': inv.paidAt ? format(new Date(inv.paidAt), 'dd/MM/yyyy HH:mm') : '',
        }));

        // Create workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 }, // Số hóa đơn
            { wch: 25 }, // Khách hàng
            { wch: 15 }, // SĐT
            { wch: 15 }, // Tạm tính
            { wch: 12 }, // Giảm giá
            { wch: 15 }, // Tổng cộng
            { wch: 15 }, // Đã thanh toán
            { wch: 15 }, // Trạng thái
            { wch: 18 }, // Ngày tạo
            { wch: 18 }, // Ngày thanh toán
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hóa đơn');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Send response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=invoices_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

// GET /export/bookings - Export bookings to Excel
router.get('/bookings', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, status } = req.query;

        const where: {
            date?: { gte?: Date; lte?: Date };
            status?: string;
        } = {};

        if (startDate) {
            where.date = where.date || {};
            where.date.gte = startOfDay(new Date(startDate as string));
        }
        if (endDate) {
            where.date = where.date || {};
            where.date.lte = endOfDay(new Date(endDate as string));
        }
        if (status) {
            where.status = status as string;
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                court: { select: { name: true } },
                customer: { select: { name: true, phone: true } },
            },
            orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
        });

        // Prepare data for Excel
        const data = bookings.map((b) => ({
            'Sân': b.court.name,
            'Khách hàng': b.customer?.name || 'Khách lẻ',
            'SĐT': b.customer?.phone || '',
            'Ngày': format(new Date(b.date), 'dd/MM/yyyy'),
            'Giờ bắt đầu': b.startTime,
            'Giờ kết thúc': b.endTime,
            'Thành tiền': b.totalAmount,
            'Trạng thái': b.status,
            'Check-in': b.checkedInAt ? format(new Date(b.checkedInAt), 'dd/MM/yyyy HH:mm') : '',
            'Check-out': b.checkedOutAt ? format(new Date(b.checkedOutAt), 'dd/MM/yyyy HH:mm') : '',
            'Ghi chú': b.notes || '',
        }));

        // Create workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
            { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 30 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Đặt sân');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=bookings_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

// GET /export/customers - Export customers to Excel
router.get('/customers', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customers = await prisma.customer.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });

        const data = customers.map((c) => ({
            'Họ tên': c.name,
            'SĐT': c.phone,
            'Email': c.email || '',
            'Địa chỉ': c.address || '',
            'Hội viên': c.membershipTier || 'Không',
            'Số lần đặt': c.totalBookings,
            'Tổng chi tiêu': c.totalSpent,
            'Điểm tích lũy': c.points,
            'Ngày tạo': format(new Date(c.createdAt), 'dd/MM/yyyy'),
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 40 },
            { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Khách hàng');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=customers_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

// GET /export/revenue-report - Export revenue report to Excel
router.get('/revenue-report', authenticate, authorize('ADMIN', 'MANAGER'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month } = req.query;

        let startDate: Date;
        let endDate: Date;

        if (month) {
            const [year, m] = (month as string).split('-').map(Number);
            startDate = new Date(year, m - 1, 1);
            endDate = endOfMonth(startDate);
        } else {
            // Default: current month
            startDate = startOfMonth(new Date());
            endDate = endOfMonth(new Date());
        }

        // Get daily revenue
        const invoices = await prisma.invoice.findMany({
            where: {
                paymentStatus: 'PAID',
                paidAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { paidAt: 'asc' },
        });

        // Group by date
        const dailyMap = new Map<string, { revenue: number; count: number }>();

        invoices.forEach((inv) => {
            const dateKey = format(new Date(inv.paidAt!), 'dd/MM/yyyy');
            const existing = dailyMap.get(dateKey) || { revenue: 0, count: 0 };
            dailyMap.set(dateKey, {
                revenue: existing.revenue + inv.total,
                count: existing.count + 1,
            });
        });

        const data = Array.from(dailyMap.entries()).map(([date, stats]) => ({
            'Ngày': date,
            'Số hóa đơn': stats.count,
            'Doanh thu': stats.revenue,
        }));

        // Add summary row
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        data.push({
            'Ngày': 'TỔNG CỘNG',
            'Số hóa đơn': invoices.length,
            'Doanh thu': totalRevenue,
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 15 }, { wch: 15 }, { wch: 20 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, `Doanh thu ${format(startDate, 'MM-yyyy')}`);

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=revenue_${format(startDate, 'yyyyMM')}.xlsx`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

export default router;
