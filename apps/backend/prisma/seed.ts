import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@courthub.vn',
            passwordHash: adminPassword,
            name: 'Super Admin',
            phone: '0901234567',
            role: 'SUPER_ADMIN',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 12);
    const manager = await prisma.user.create({
        data: {
            email: 'manager@courthub.vn',
            passwordHash: managerPassword,
            name: 'Nguyễn Văn Quản Lý',
            phone: '0902345678',
            role: 'MANAGER',
        },
    });
    console.log('✅ Created manager user:', manager.email);

    // Create staff users
    const staffPassword = await bcrypt.hash('staff123', 12);
    const staff1 = await prisma.user.create({
        data: {
            email: 'staff@courthub.vn',
            passwordHash: staffPassword,
            name: 'Trần Thị Nhân Viên',
            phone: '0903456789',
            role: 'STAFF',
        },
    });

    const staff2 = await prisma.user.create({
        data: {
            email: 'staff2@courthub.vn',
            passwordHash: staffPassword,
            name: 'Lê Văn Ca Tối',
            phone: '0904567890',
            role: 'STAFF',
        },
    });
    console.log('✅ Created 2 staff users');

    // Create venues
    const venue1 = await prisma.venue.create({
        data: {
            name: 'CourtHub Phú Nhuận',
            address: '123 Phan Xích Long, Phường 2, Quận Phú Nhuận, TP.HCM',
            phone: '028 1234 5678',
            email: 'phunhuan@courthub.vn',
            description: 'Sân cầu lông cao cấp tại Phú Nhuận với 4 sân tiêu chuẩn quốc tế',
            openTime: '06:00',
            closeTime: '23:00',
        },
    });

    const venue2 = await prisma.venue.create({
        data: {
            name: 'CourtHub Quận 7',
            address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
            phone: '028 2345 6789',
            email: 'quan7@courthub.vn',
            description: 'Sân cầu lông hiện đại tại Quận 7 với view sông Sài Gòn',
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
            { userId: staff1.id, venueId: venue1.id, role: 'STAFF' },
            { userId: staff2.id, venueId: venue1.id, role: 'STAFF' },
        ],
    });
    console.log('✅ Assigned staff to venues');

    // Create courts for venue 1
    const courtsVenue1 = await Promise.all([
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

    // Create courts for venue 2
    await Promise.all([
        prisma.court.create({
            data: {
                venueId: venue2.id,
                name: 'Sân 1',
                description: 'Sân view sông',
                surfaceType: 'Synthetic',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 1,
            },
        }),
        prisma.court.create({
            data: {
                venueId: venue2.id,
                name: 'Sân 2',
                description: 'Sân tiêu chuẩn',
                surfaceType: 'Synthetic',
                isIndoor: true,
                status: 'ACTIVE',
                sortOrder: 2,
            },
        }),
    ]);
    console.log('✅ Created 2 courts for venue 2');

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
                name: 'Giờ cao điểm sáng',
                description: 'Từ 06:00 - 08:00',
                startTime: '06:00',
                endTime: '08:00',
                pricePerHour: 180000,
                priority: 5,
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
                name: 'Thuê vợt Yonex Astrox',
                description: 'Vợt Yonex Astrox 88D Pro - chất lượng cao',
                price: 50000,
                unit: 'cây/buổi',
            },
            {
                venueId: venue1.id,
                name: 'Thuê vợt tiêu chuẩn',
                description: 'Vợt cầu lông tiêu chuẩn',
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
                name: 'Huấn luyện viên cá nhân',
                description: 'HLV hướng dẫn 1-1, trình độ quốc gia',
                price: 300000,
                unit: 'giờ',
            },
            {
                venueId: venue1.id,
                name: 'Huấn luyện viên nhóm',
                description: 'HLV hướng dẫn nhóm 2-4 người',
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
                description: 'Hộp 12 quả - cầu thi đấu',
                price: 350000,
                stock: 50,
                unit: 'hộp',
            },
            {
                venueId: venue1.id,
                name: 'Cầu Yonex AS-20',
                description: 'Hộp 12 quả - cầu tập luyện',
                price: 250000,
                stock: 80,
                unit: 'hộp',
            },
            {
                venueId: venue1.id,
                name: 'Nước suối Aquafina 500ml',
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
                name: 'Nước tăng lực RedBull',
                price: 20000,
                stock: 80,
                unit: 'lon',
            },
            {
                venueId: venue1.id,
                name: 'Khăn thể thao Yonex',
                price: 80000,
                stock: 30,
                unit: 'cái',
            },
            {
                venueId: venue1.id,
                name: 'Băng tay thể thao',
                price: 35000,
                stock: 50,
                unit: 'đôi',
            },
            {
                venueId: venue1.id,
                name: 'Cuốn cán vợt Yonex',
                price: 25000,
                stock: 100,
                unit: 'cái',
            },
        ],
    });
    console.log('✅ Created products');

    // Create customers (more comprehensive)
    const customersData = [
        { name: 'Nguyễn Văn An', phone: '0912345678', email: 'nguyenvanan@gmail.com', membershipTier: 'GOLD', membershipStart: new Date('2026-01-01'), membershipEnd: new Date('2026-12-31'), totalBookings: 48, totalSpent: 12500000, points: 1250 },
        { name: 'Trần Thị Bình', phone: '0923456789', email: 'tranthibinh@gmail.com', membershipTier: 'SILVER', membershipStart: new Date('2026-01-15'), membershipEnd: new Date('2026-04-15'), totalBookings: 24, totalSpent: 5200000, points: 520 },
        { name: 'Lê Văn Cường', phone: '0934567890', totalBookings: 12, totalSpent: 2400000, points: 240 },
        { name: 'Phạm Thị Dung', phone: '0945678901', email: 'phamthidung@gmail.com', membershipTier: 'BRONZE', membershipStart: new Date('2026-02-01'), membershipEnd: new Date('2026-03-01'), totalBookings: 18, totalSpent: 3600000, points: 360 },
        { name: 'Hoàng Minh Tuấn', phone: '0956789012', email: 'hoangtuan@gmail.com', membershipTier: 'PLATINUM', membershipStart: new Date('2025-06-01'), membershipEnd: new Date('2026-06-01'), totalBookings: 156, totalSpent: 45000000, points: 4500 },
        { name: 'Vũ Thị Hạnh', phone: '0967890123', email: 'vuhanh@gmail.com', membershipTier: 'GOLD', membershipStart: new Date('2025-12-01'), membershipEnd: new Date('2026-06-01'), totalBookings: 36, totalSpent: 9800000, points: 980 },
        { name: 'Đặng Văn Khoa', phone: '0978901234', totalBookings: 8, totalSpent: 1600000, points: 160 },
        { name: 'Bùi Thị Lan', phone: '0989012345', email: 'builan@gmail.com', totalBookings: 5, totalSpent: 1000000, points: 100 },
        { name: 'Ngô Văn Mạnh', phone: '0990123456', totalBookings: 3, totalSpent: 600000, points: 60 },
        { name: 'Đinh Thị Ngọc', phone: '0901234567', email: 'dinhngoc@gmail.com', membershipTier: 'SILVER', membershipStart: new Date('2026-01-20'), membershipEnd: new Date('2026-04-20'), totalBookings: 28, totalSpent: 6300000, points: 630 },
        { name: 'Trương Văn Phong', phone: '0911234567', totalBookings: 15, totalSpent: 3000000, points: 300 },
        { name: 'Lý Thị Quỳnh', phone: '0921234567', email: 'lyquynh@gmail.com', totalBookings: 7, totalSpent: 1400000, points: 140 },
    ];

    const customers = await Promise.all(
        customersData.map(c => prisma.customer.create({ data: c }))
    );
    console.log(`✅ Created ${customers.length} customers`);

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

    // Create sample bookings - past 7 days + today + tomorrow
    const courts = courtsVenue1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeSlots = [
        { start: '06:00', end: '07:30', amount: 225000 },
        { start: '07:30', end: '09:00', amount: 225000 },
        { start: '09:00', end: '10:30', amount: 225000 },
        { start: '10:30', end: '12:00', amount: 225000 },
        { start: '14:00', end: '15:30', amount: 225000 },
        { start: '15:30', end: '17:00', amount: 225000 },
        { start: '17:00', end: '18:30', amount: 300000 },
        { start: '18:30', end: '20:00', amount: 300000 },
        { start: '20:00', end: '21:30', amount: 300000 },
        { start: '21:30', end: '23:00', amount: 300000 },
    ];

    let bookingCount = 0;

    // Past 7 days bookings (completed)
    for (let dayOffset = -7; dayOffset <= -1; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);

        for (const court of courts) {
            // Random 4-6 bookings per court per day
            const numBookings = Math.floor(Math.random() * 3) + 4;
            const usedSlots = new Set<number>();

            for (let j = 0; j < numBookings; j++) {
                let slotIndex;
                do {
                    slotIndex = Math.floor(Math.random() * timeSlots.length);
                } while (usedSlots.has(slotIndex));
                usedSlots.add(slotIndex);

                const slot = timeSlots[slotIndex];
                const customer = customers[Math.floor(Math.random() * customers.length)];

                await prisma.booking.create({
                    data: {
                        courtId: court.id,
                        customerId: customer.id,
                        date,
                        startTime: slot.start,
                        endTime: slot.end,
                        status: 'COMPLETED',
                        totalAmount: slot.amount,
                        createdById: admin.id,
                        checkedInAt: new Date(date.getTime() + parseInt(slot.start.split(':')[0]) * 3600000),
                        checkedOutAt: new Date(date.getTime() + parseInt(slot.end.split(':')[0]) * 3600000),
                    },
                });
                bookingCount++;
            }
        }
    }

    // Today's bookings (mix of statuses)
    const todayStatuses = ['COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'CONFIRMED', 'CONFIRMED', 'CONFIRMED'];
    for (const court of courts) {
        const numBookings = Math.floor(Math.random() * 3) + 4;
        const usedSlots = new Set<number>();

        for (let j = 0; j < numBookings; j++) {
            let slotIndex;
            do {
                slotIndex = Math.floor(Math.random() * timeSlots.length);
            } while (usedSlots.has(slotIndex));
            usedSlots.add(slotIndex);

            const slot = timeSlots[slotIndex];
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const status = todayStatuses[Math.floor(Math.random() * todayStatuses.length)];

            await prisma.booking.create({
                data: {
                    courtId: court.id,
                    customerId: customer.id,
                    date: today,
                    startTime: slot.start,
                    endTime: slot.end,
                    status,
                    totalAmount: slot.amount,
                    createdById: admin.id,
                    checkedInAt: status === 'COMPLETED' || status === 'IN_PROGRESS' ? new Date() : null,
                    checkedOutAt: status === 'COMPLETED' ? new Date() : null,
                },
            });
            bookingCount++;
        }
    }

    // Tomorrow and future bookings (confirmed)
    for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);

        for (const court of courts) {
            const numBookings = Math.floor(Math.random() * 3) + 2;
            const usedSlots = new Set<number>();

            for (let j = 0; j < numBookings; j++) {
                let slotIndex;
                do {
                    slotIndex = Math.floor(Math.random() * timeSlots.length);
                } while (usedSlots.has(slotIndex));
                usedSlots.add(slotIndex);

                const slot = timeSlots[slotIndex];
                const customer = customers[Math.floor(Math.random() * customers.length)];

                await prisma.booking.create({
                    data: {
                        courtId: court.id,
                        customerId: customer.id,
                        date,
                        startTime: slot.start,
                        endTime: slot.end,
                        status: Math.random() > 0.2 ? 'CONFIRMED' : 'PENDING',
                        totalAmount: slot.amount,
                        createdById: admin.id,
                    },
                });
                bookingCount++;
            }
        }
    }

    // Create recurring bookings
    const recurringGroupId = crypto.randomUUID();
    const recurringCustomer = customers[4]; // Hoàng Minh Tuấn - PLATINUM member

    for (let week = 0; week < 4; week++) {
        const date = new Date(today);
        date.setDate(date.getDate() + (week * 7) + 2); // Starting from day after tomorrow, every Tuesday
        if (date.getDay() !== 2) {
            date.setDate(date.getDate() + (2 - date.getDay() + 7) % 7);
        }

        await prisma.booking.create({
            data: {
                courtId: courts[3].id, // VIP court
                customerId: recurringCustomer.id,
                date,
                startTime: '18:00',
                endTime: '20:00',
                status: week === 0 ? 'CONFIRMED' : 'CONFIRMED',
                totalAmount: 400000,
                notes: 'Lịch cố định hàng tuần',
                isRecurring: true,
                recurringGroup: recurringGroupId,
                createdById: admin.id,
            },
        });
        bookingCount++;
    }

    console.log(`✅ Created ${bookingCount} sample bookings (including recurring)`);

    // Create sample invoices - past 7 days
    let invoiceCount = 0;

    for (let dayOffset = -7; dayOffset <= 0; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);

        // 3-6 invoices per day
        const numInvoices = Math.floor(Math.random() * 4) + 3;

        for (let i = 0; i < numInvoices; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const subtotal = (Math.floor(Math.random() * 5) + 2) * 150000;
            const discount = customer.membershipTier ? Math.floor(subtotal * 0.1) : 0;
            const total = subtotal - discount;

            const invoiceNumber = `INV${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(invoiceCount + 1).padStart(4, '0')}`;

            await prisma.invoice.create({
                data: {
                    invoiceNumber,
                    customerId: customer.id,
                    subtotal,
                    discount,
                    total,
                    paymentStatus: dayOffset === 0 && i > numInvoices - 2 ? 'PENDING' : 'PAID',
                    paidAmount: dayOffset === 0 && i > numInvoices - 2 ? 0 : total,
                    paidAt: dayOffset === 0 && i > numInvoices - 2 ? null : date,
                    createdAt: date,
                    items: {
                        create: [
                            {
                                description: `Thuê sân ${courts[Math.floor(Math.random() * courts.length)].name}`,
                                quantity: Math.floor(Math.random() * 2) + 1,
                                unitPrice: 150000 + Math.floor(Math.random() * 3) * 50000,
                                total: subtotal - 50000,
                            },
                            {
                                description: 'Nước uống + phụ kiện',
                                quantity: 1,
                                unitPrice: 50000,
                                total: 50000,
                            },
                        ],
                    },
                },
            });
            invoiceCount++;
        }
    }
    console.log(`✅ Created ${invoiceCount} sample invoices`);

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Test accounts:');
    console.log('   Admin:    admin@courthub.vn / admin123');
    console.log('   Manager:  manager@courthub.vn / manager123');
    console.log('   Staff:    staff@courthub.vn / staff123');
    console.log('\n📊 Seed data summary:');
    console.log(`   - ${customers.length} customers`);
    console.log(`   - ${bookingCount} bookings`);
    console.log(`   - ${invoiceCount} invoices`);
    console.log(`   - 4 courts (venue 1) + 2 courts (venue 2)`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
