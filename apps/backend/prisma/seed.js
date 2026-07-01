"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Clean existing data (SQLite doesn't support TRUNCATE)
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.service.deleteMany();
    await prisma.product.deleteMany();
    await prisma.court.deleteMany();
    await prisma.venueStaff.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.venue.deleteMany();
    await prisma.user.deleteMany();
    await prisma.membershipPlan.deleteMany();
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('admin123', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@courtify.vn',
            passwordHash: adminPassword,
            name: 'Super Admin',
            phone: '0901234567',
            role: 'SUPER_ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);
    // Create manager user
    const managerPassword = await bcryptjs_1.default.hash('manager123', 12);
    const manager = await prisma.user.create({
        data: {
            email: 'manager@courtify.vn',
            passwordHash: managerPassword,
            name: 'Nguyễn Văn Quản Lý',
            phone: '0902345678',
            role: 'MANAGER',
        },
    });
    console.log('✅ Created manager user:', manager.email);
    // Create staff user
    const staffPassword = await bcryptjs_1.default.hash('staff123', 12);
    const staff = await prisma.user.create({
        data: {
            email: 'staff@courtify.vn',
            passwordHash: staffPassword,
            name: 'Trần Thị Nhân Viên',
            phone: '0903456789',
            role: 'STAFF',
        },
    });
    console.log('✅ Created staff user:', staff.email);
    // Create venues
    const venue1 = await prisma.venue.create({
        data: {
            name: 'Courtify Phú Nhuận',
            address: '123 Phan Xích Long, Phường 2, Quận Phú Nhuận, TP.HCM',
            phone: '028 1234 5678',
            email: 'phunhuan@courtify.vn',
            description: 'Sân cầu lông cao cấp tại Phú Nhuận',
            openTime: '06:00',
            closeTime: '23:00',
        },
    });
    const venue2 = await prisma.venue.create({
        data: {
            name: 'Courtify Quận 7',
            address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
            phone: '028 2345 6789',
            email: 'quan7@courtify.vn',
            description: 'Sân cầu lông hiện đại tại Quận 7',
            openTime: '06:00',
            closeTime: '23:00',
        },
    });
    console.log('✅ Created 2 venues');
    // Assign staff to venues
    await prisma.venueStaff.createMany({
        data: [
            { userId: admin.id, venueId: venue1.id, role: 'SUPER_ADMIN' },
            { userId: admin.id, venueId: venue2.id, role: 'SUPER_ADMIN' },
            { userId: manager.id, venueId: venue1.id, role: 'MANAGER' },
            { userId: staff.id, venueId: venue1.id, role: 'STAFF' },
        ],
    });
    console.log('✅ Assigned staff to venues');
    // Create courts for venue 1
    await Promise.all([
        prisma.court.create({
            data: {
                venueId: venue1.id,
                name: 'Sân A1',
                description: 'Sân tiêu chuẩn thi đấu quốc tế',
                surfaceType: 'Synthetic',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 1,
            },
        }),
        prisma.court.create({
            data: {
                venueId: venue1.id,
                name: 'Sân A2',
                description: 'Sân tiêu chuẩn, đèn LED',
                surfaceType: 'Synthetic',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 2,
            },
        }),
        prisma.court.create({
            data: {
                venueId: venue1.id,
                name: 'Sân B1',
                description: 'Sân tập luyện',
                surfaceType: 'Wooden',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 3,
            },
        }),
        prisma.court.create({
            data: {
                venueId: venue1.id,
                name: 'Sân VIP',
                description: 'Sân VIP có máy lạnh, phòng chờ riêng',
                surfaceType: 'Synthetic Pro',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 4,
            },
        }),
    ]);
    console.log('✅ Created 4 courts for venue 1');
    // Create pricing rules
    await prisma.pricingRule.createMany({
        data: [
            {
                venueId: venue1.id,
                name: 'Giá mặc định',
                description: 'Giá áp dụng cho tất cả các khung giờ',
                pricePerHour: 150000,
                priority: 0,
            },
            {
                venueId: venue1.id,
                name: 'Giờ cao điểm tối',
                description: 'Từ 17:00 - 21:00',
                startTime: '17:00',
                endTime: '21:00',
                pricePerHour: 200000,
                priority: 10,
            },
            {
                venueId: venue1.id,
                name: 'Cuối tuần - Thứ 7',
                dayOfWeek: 'SATURDAY',
                pricePerHour: 180000,
                priority: 5,
            },
            {
                venueId: venue1.id,
                name: 'Cuối tuần - Chủ nhật',
                dayOfWeek: 'SUNDAY',
                pricePerHour: 180000,
                priority: 5,
            },
        ],
    });
    console.log('✅ Created pricing rules');
    // Create services
    await prisma.service.createMany({
        data: [
            {
                venueId: venue1.id,
                name: 'Thuê vợt',
                description: 'Vợt Yonex chất lượng cao',
                price: 30000,
                unit: 'cây/buổi',
            },
            {
                venueId: venue1.id,
                name: 'Thuê giày',
                description: 'Giày cầu lông chuyên dụng',
                price: 20000,
                unit: 'đôi/buổi',
            },
            {
                venueId: venue1.id,
                name: 'Huấn luyện viên',
                description: 'HLV hướng dẫn 1-1',
                price: 200000,
                unit: 'giờ',
            },
        ],
    });
    console.log('✅ Created services');
    // Create products
    await prisma.product.createMany({
        data: [
            {
                venueId: venue1.id,
                name: 'Cầu Yonex AS-30',
                description: 'Hộp 12 quả',
                price: 350000,
                stock: 50,
                unit: 'hộp',
            },
            {
                venueId: venue1.id,
                name: 'Nước suối Aquafina',
                price: 10000,
                stock: 200,
                unit: 'chai',
            },
            {
                venueId: venue1.id,
                name: 'Nước tăng lực Sting',
                price: 15000,
                stock: 100,
                unit: 'chai',
            },
            {
                venueId: venue1.id,
                name: 'Khăn thể thao',
                price: 50000,
                stock: 30,
                unit: 'cái',
            },
        ],
    });
    console.log('✅ Created products');
    // Create customers
    await Promise.all([
        prisma.customer.create({
            data: {
                name: 'Nguyễn Văn An',
                phone: '0912345678',
                email: 'nguyenvanan@gmail.com',
                membershipTier: 'GOLD',
                membershipStart: new Date('2026-01-01'),
                membershipEnd: new Date('2026-12-31'),
                totalBookings: 25,
                totalSpent: 5000000,
                points: 500,
            },
        }),
        prisma.customer.create({
            data: {
                name: 'Trần Thị Bình',
                phone: '0923456789',
                email: 'tranthibinh@gmail.com',
                membershipTier: 'SILVER',
                totalBookings: 12,
                totalSpent: 2400000,
                points: 240,
            },
        }),
        prisma.customer.create({
            data: {
                name: 'Lê Văn Cường',
                phone: '0934567890',
                totalBookings: 5,
                totalSpent: 1000000,
                points: 100,
            },
        }),
        prisma.customer.create({
            data: {
                name: 'Phạm Thị Dung',
                phone: '0945678901',
                email: 'phamthidung@gmail.com',
                membershipTier: 'BRONZE',
                totalBookings: 8,
                totalSpent: 1600000,
                points: 160,
            },
        }),
    ]);
    console.log('✅ Created 4 customers');
    // Create membership plans
    await prisma.membershipPlan.createMany({
        data: [
            {
                tier: 'BRONZE',
                name: 'Gói Đồng',
                description: 'Gói cơ bản cho người mới',
                price: 500000,
                durationDays: 30,
                discount: 5,
                benefits: JSON.stringify(['Giảm 5% giá thuê sân', 'Tích điểm 1%']),
            },
            {
                tier: 'SILVER',
                name: 'Gói Bạc',
                description: 'Gói phổ biến',
                price: 1000000,
                durationDays: 90,
                discount: 10,
                benefits: JSON.stringify(['Giảm 10% giá thuê sân', 'Tích điểm 2%', 'Ưu tiên đặt sân']),
            },
            {
                tier: 'GOLD',
                name: 'Gói Vàng',
                description: 'Gói cao cấp',
                price: 2500000,
                durationDays: 180,
                discount: 15,
                benefits: JSON.stringify(['Giảm 15% giá thuê sân', 'Tích điểm 3%', 'Ưu tiên đặt sân VIP', 'Miễn phí thuê vợt']),
            },
            {
                tier: 'PLATINUM',
                name: 'Gói Bạch Kim',
                description: 'Gói VIP dành cho khách hàng thân thiết',
                price: 5000000,
                durationDays: 365,
                discount: 20,
                benefits: JSON.stringify([
                    'Giảm 20% giá thuê sân',
                    'Tích điểm 5%',
                    'Đặt sân không giới hạn',
                    'Miễn phí thuê vợt + giày',
                    'Phòng chờ VIP',
                    '2 buổi HLV miễn phí/tháng',
                ]),
            },
        ],
    });
    console.log('✅ Created membership plans');
    // Create sample bookings for today and tomorrow
    const courts = await prisma.court.findMany({ where: { venueId: venue1.id }, orderBy: { sortOrder: 'asc' } });
    const customers = await prisma.customer.findMany();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Today's bookings
    const bookingsData = [
        // Court A1 - Sân 1
        { courtId: courts[0].id, customerId: customers[0].id, date: today, startTime: '07:00', endTime: '08:00', status: 'COMPLETED', totalAmount: 150000 },
        { courtId: courts[0].id, customerId: customers[1].id, date: today, startTime: '08:00', endTime: '10:00', status: 'COMPLETED', totalAmount: 300000 },
        { courtId: courts[0].id, customerId: customers[2].id, date: today, startTime: '14:00', endTime: '15:30', status: 'CONFIRMED', totalAmount: 225000 },
        { courtId: courts[0].id, customerId: customers[0].id, date: today, startTime: '17:00', endTime: '18:30', status: 'CONFIRMED', totalAmount: 300000 },
        { courtId: courts[0].id, customerId: customers[3].id, date: today, startTime: '19:00', endTime: '21:00', status: 'CONFIRMED', totalAmount: 400000 },
        // Court A2 - Sân 2
        { courtId: courts[1].id, customerId: customers[1].id, date: today, startTime: '06:00', endTime: '07:30', status: 'COMPLETED', totalAmount: 225000 },
        { courtId: courts[1].id, customerId: customers[2].id, date: today, startTime: '09:00', endTime: '11:00', status: 'COMPLETED', totalAmount: 300000 },
        { courtId: courts[1].id, customerId: customers[3].id, date: today, startTime: '15:00', endTime: '17:00', status: 'IN_PROGRESS', totalAmount: 300000 },
        { courtId: courts[1].id, customerId: customers[0].id, date: today, startTime: '18:00', endTime: '20:00', status: 'CONFIRMED', totalAmount: 400000 },
        // Court B1 - Sân 3
        { courtId: courts[2].id, customerId: customers[0].id, date: today, startTime: '08:00', endTime: '09:00', status: 'COMPLETED', totalAmount: 150000 },
        { courtId: courts[2].id, customerId: customers[1].id, date: today, startTime: '10:00', endTime: '12:00', status: 'COMPLETED', totalAmount: 300000 },
        { courtId: courts[2].id, customerId: customers[3].id, date: today, startTime: '16:00', endTime: '18:00', status: 'CONFIRMED', totalAmount: 350000 },
        { courtId: courts[2].id, customerId: customers[2].id, date: today, startTime: '19:00', endTime: '20:30', status: 'CONFIRMED', totalAmount: 300000 },
        // Court VIP - Sân 4
        { courtId: courts[3].id, customerId: customers[0].id, date: today, startTime: '07:00', endTime: '09:00', status: 'COMPLETED', totalAmount: 400000, notes: 'Khách VIP - đặt trước' },
        { courtId: courts[3].id, customerId: customers[1].id, date: today, startTime: '17:00', endTime: '19:00', status: 'CONFIRMED', totalAmount: 500000, notes: 'Có HLV đi kèm' },
        { courtId: courts[3].id, customerId: customers[0].id, date: today, startTime: '20:00', endTime: '22:00', status: 'CONFIRMED', totalAmount: 500000 },
        // Tomorrow's bookings
        { courtId: courts[0].id, customerId: customers[0].id, date: tomorrow, startTime: '08:00', endTime: '10:00', status: 'CONFIRMED', totalAmount: 300000 },
        { courtId: courts[0].id, customerId: customers[2].id, date: tomorrow, startTime: '14:00', endTime: '16:00', status: 'CONFIRMED', totalAmount: 300000 },
        { courtId: courts[1].id, customerId: customers[1].id, date: tomorrow, startTime: '09:00', endTime: '11:00', status: 'PENDING', totalAmount: 300000 },
        { courtId: courts[2].id, customerId: customers[3].id, date: tomorrow, startTime: '17:00', endTime: '19:00', status: 'CONFIRMED', totalAmount: 350000 },
        { courtId: courts[3].id, customerId: customers[0].id, date: tomorrow, startTime: '18:00', endTime: '20:00', status: 'CONFIRMED', totalAmount: 500000, notes: 'Sinh nhật khách hàng' },
    ];
    for (const booking of bookingsData) {
        await prisma.booking.create({
            data: {
                ...booking,
                createdById: admin.id,
            },
        });
    }
    console.log(`✅ Created ${bookingsData.length} sample bookings`);
    // Create sample invoices matching schema (uses total, paymentStatus, no venueId/createdById)
    const invoicesData = [
        {
            invoiceNumber: 'INV202602040001',
            customerId: customers[0].id,
            subtotal: 450000,
            discount: 50000,
            total: 400000,
            paymentStatus: 'PAID',
            paidAmount: 400000,
            paidAt: new Date(),
            items: [
                { description: 'San A1 - 07:00 den 09:00', quantity: 1, unitPrice: 300000, total: 300000 },
                { description: 'Thue vot x2', quantity: 2, unitPrice: 50000, total: 100000 },
                { description: 'Nuoc suoi x2', quantity: 2, unitPrice: 25000, total: 50000 },
            ]
        },
        {
            invoiceNumber: 'INV202602040002',
            customerId: customers[1].id,
            subtotal: 500000,
            discount: 0,
            total: 500000,
            paymentStatus: 'PAID',
            paidAmount: 500000,
            paidAt: new Date(),
            items: [
                { description: 'San VIP - 17:00 den 19:00', quantity: 1, unitPrice: 500000, total: 500000 },
            ]
        },
        {
            invoiceNumber: 'INV202602040003',
            customerId: customers[2].id,
            subtotal: 350000,
            discount: 0,
            total: 350000,
            paymentStatus: 'PENDING',
            paidAmount: 0,
            items: [
                { description: 'San B1 - 14:00 den 16:00', quantity: 1, unitPrice: 300000, total: 300000 },
                { description: 'Cau long', quantity: 1, unitPrice: 50000, total: 50000 },
            ]
        },
        {
            invoiceNumber: 'INV202602040004',
            customerId: customers[3].id,
            subtotal: 750000,
            discount: 75000,
            total: 675000,
            paymentStatus: 'PAID',
            paidAmount: 675000,
            paidAt: new Date(),
            items: [
                { description: 'San A2 - 09:00 den 11:00', quantity: 1, unitPrice: 300000, total: 300000 },
                { description: 'San A2 - 11:00 den 13:00', quantity: 1, unitPrice: 300000, total: 300000 },
                { description: 'Huan luyen vien', quantity: 1, unitPrice: 150000, total: 150000 },
            ]
        },
        {
            invoiceNumber: 'INV202602040005',
            customerId: null,
            subtotal: 200000,
            discount: 0,
            total: 200000,
            paymentStatus: 'PENDING',
            paidAmount: 0,
            items: [
                { description: 'San A1 - 16:00 den 17:00', quantity: 1, unitPrice: 150000, total: 150000 },
                { description: 'Nuoc ngot x2', quantity: 2, unitPrice: 25000, total: 50000 },
            ]
        },
        {
            invoiceNumber: 'INV202602030001',
            customerId: customers[0].id,
            subtotal: 600000,
            discount: 60000,
            total: 540000,
            paymentStatus: 'PAID',
            paidAmount: 540000,
            paidAt: new Date(Date.now() - 86400000),
            items: [
                { description: 'San VIP - 08:00 den 10:00', quantity: 1, unitPrice: 400000, total: 400000 },
                { description: 'Thue giay x2', quantity: 2, unitPrice: 50000, total: 100000 },
                { description: 'Tra da x4', quantity: 4, unitPrice: 25000, total: 100000 },
            ]
        },
        {
            invoiceNumber: 'INV202602030002',
            customerId: customers[1].id,
            subtotal: 300000,
            discount: 0,
            total: 300000,
            paymentStatus: 'REFUNDED',
            paidAmount: 0,
            notes: 'Khach huy do troi mua',
            items: [
                { description: 'San A1 - 18:00 den 20:00', quantity: 1, unitPrice: 300000, total: 300000 },
            ]
        },
    ];
    for (const invoiceData of invoicesData) {
        const { items, ...invoice } = invoiceData;
        await prisma.invoice.create({
            data: {
                ...invoice,
                items: {
                    create: items,
                },
            },
        });
    }
    console.log(`✅ Created ${invoicesData.length} sample invoices`);
    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Test accounts:');
    console.log('   Admin:   admin@courtify.vn / admin123');
    console.log('   Manager: manager@courtify.vn / manager123');
    console.log('   Staff:   staff@courtify.vn / staff123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map