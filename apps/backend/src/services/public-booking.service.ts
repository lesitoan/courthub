import prisma from '../config/database.js';
import { AppError } from '../middleware/error.js';
import { bookingService } from './booking.service.js';

type AddonType = 'product' | 'service';

interface PublicAddonInput {
    type: AddonType;
    id: string;
    quantity: number;
}

interface ParsedAddon {
    type: AddonType;
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    total: number;
}

interface CreatePublicBookingInput {
    venueId: string;
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    notes?: string;
    addons?: PublicAddonInput[];
}

interface ReschedulePublicBookingInput {
    phone: string;
    courtId?: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
}

const ONLINE_BOOKING_MARKER = '[ONLINE_BOOKING_META]';
const CHANGE_WINDOW_HOURS = 2;

function normalizePhone(phone: string) {
    return phone.replace(/\D/g, '');
}

function parseLocalDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

function getBookingStart(date: Date, startTime: string) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes || 0, 0, 0);
    return result;
}

function canChangeBooking(date: Date, startTime: string) {
    const startsAt = getBookingStart(date, startTime);
    const diffMs = startsAt.getTime() - Date.now();
    return diffMs >= CHANGE_WINDOW_HOURS * 60 * 60 * 1000;
}

function isFutureBookingStart(date: Date, startTime: string) {
    return getBookingStart(date, startTime).getTime() > Date.now();
}

function addOnlineMeta(notes: string | undefined, addons: ParsedAddon[], source = 'ONLINE') {
    const publicNotes = notes?.trim() || '';
    const meta = JSON.stringify({ source, addons });
    return `${publicNotes}${publicNotes ? '\n' : ''}${ONLINE_BOOKING_MARKER}${meta}`;
}

function parseOnlineMeta(notes?: string | null): { publicNotes?: string; addons: ParsedAddon[]; source?: string } {
    if (!notes?.includes(ONLINE_BOOKING_MARKER)) {
        return { publicNotes: notes || undefined, addons: [] };
    }

    const [publicNotes, rawMeta] = notes.split(ONLINE_BOOKING_MARKER);
    try {
        const meta = JSON.parse(rawMeta || '{}');
        return {
            publicNotes: publicNotes.trim() || undefined,
            addons: Array.isArray(meta.addons) ? meta.addons : [],
            source: meta.source,
        };
    } catch {
        return { publicNotes: publicNotes.trim() || undefined, addons: [] };
    }
}

function toDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculatePoints(amount: number) {
    return Math.floor(amount / 10000);
}

async function findOrCreateCustomer(input: {
    name: string;
    phone: string;
    email?: string;
}) {
    const phone = normalizePhone(input.phone);
    if (phone.length < 9) {
        throw new AppError(400, 'So dien thoai khong hop le');
    }

    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) {
        return prisma.customer.update({
            where: { id: existing.id },
            data: {
                name: input.name || existing.name,
                email: input.email || existing.email,
            },
        });
    }

    return prisma.customer.create({
        data: {
            name: input.name,
            phone,
            email: input.email,
            isActive: true,
        },
    });
}

async function resolveAddons(venueId: string, addons: PublicAddonInput[] = []) {
    const resolved: ParsedAddon[] = [];

    for (const addon of addons) {
        const quantity = Number(addon.quantity || 0);
        if (!addon.id || quantity <= 0) continue;

        if (addon.type === 'product') {
            const product = await prisma.product.findFirst({
                where: { id: addon.id, venueId, isActive: true },
            });
            if (!product) continue;
            if (product.stock < quantity) {
                throw new AppError(400, `${product.name} khong du ton kho`);
            }
            resolved.push({
                type: 'product',
                id: product.id,
                name: product.name,
                quantity,
                unitPrice: product.price,
                unit: product.unit,
                total: product.price * quantity,
            });
        }

        if (addon.type === 'service') {
            const service = await prisma.service.findFirst({
                where: { id: addon.id, venueId, isActive: true },
            });
            if (!service) continue;
            resolved.push({
                type: 'service',
                id: service.id,
                name: service.name,
                quantity,
                unitPrice: service.price,
                unit: service.unit,
                total: service.price * quantity,
            });
        }
    }

    return resolved;
}

function mapBooking(booking: any) {
    const meta = parseOnlineMeta(booking.notes);
    const addonTotal = meta.addons.reduce((sum, addon) => sum + addon.total, 0);
    const courtAmount = Math.max(booking.totalAmount - addonTotal, 0);

    return {
        ...booking,
        bookingCode: `CFT-${booking.id.slice(-8).toUpperCase()}`,
        date: toDateString(booking.date),
        notes: meta.publicNotes,
        source: meta.source || 'STAFF',
        addons: meta.addons,
        addonTotal,
        courtAmount,
        canChange: ['PENDING', 'CONFIRMED'].includes(booking.status) && canChangeBooking(booking.date, booking.startTime),
        estimatedPoints: calculatePoints(booking.totalAmount),
    };
}

function buildSlotTimes(openTime: string, closeTime: string) {
    const [openH] = openTime.split(':').map(Number);
    const [closeH] = closeTime.split(':').map(Number);
    const slots: Array<{ startTime: string; endTime: string }> = [];

    for (let hour = openH; hour < closeH; hour += 1) {
        slots.push({
            startTime: `${String(hour).padStart(2, '0')}:00`,
            endTime: `${String(hour + 1).padStart(2, '0')}:00`,
        });
    }

    return slots;
}

class PublicBookingService {
    async getVenues() {
        return prisma.venue.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                email: true,
                description: true,
                logo: true,
                openTime: true,
                closeTime: true,
            },
            orderBy: { name: 'asc' },
        });
    }

    async getCourts(venueId: string) {
        return prisma.court.findMany({
            where: { venueId, status: 'ACTIVE' },
            include: {
                venue: {
                    select: { id: true, name: true, openTime: true, closeTime: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getAddons(venueId: string) {
        const [products, services] = await Promise.all([
            prisma.product.findMany({
                where: { venueId, isActive: true },
                orderBy: { name: 'asc' },
            }),
            prisma.service.findMany({
                where: { venueId, isActive: true },
                orderBy: { name: 'asc' },
            }),
        ]);

        return { products, services };
    }

    async getAvailability(courtId: string, dateString: string, excludeBookingId?: string) {
        const date = parseLocalDate(dateString);
        const court = await prisma.court.findUnique({
            where: { id: courtId },
            include: { venue: true },
        });

        if (!court || court.status !== 'ACTIVE') {
            throw new AppError(404, 'Khong tim thay san kha dung');
        }

        const slots = buildSlotTimes(court.venue.openTime, court.venue.closeTime);
        const enriched = await Promise.all(slots.map(async slot => {
            const availability = await bookingService.checkAvailability(courtId, date, slot.startTime, slot.endTime, excludeBookingId);
            const pricing = await bookingService.calculatePrice(courtId, date, slot.startTime, slot.endTime);
            const startsAt = getBookingStart(date, slot.startTime);
            return {
                ...slot,
                available: availability.available && isFutureBookingStart(date, slot.startTime),
                isPast: !isFutureBookingStart(date, slot.startTime),
                price: pricing.total,
                pricePerHour: pricing.pricePerHour,
                appliedRule: pricing.appliedRule,
            };
        }));

        return {
            courtId,
            date: dateString,
            slots: enriched,
        };
    }

    async createBooking(input: CreatePublicBookingInput) {
        const venue = await prisma.venue.findUnique({ where: { id: input.venueId } });
        if (!venue || !venue.isActive) {
            throw new AppError(404, 'Khong tim thay co so');
        }

        const date = parseLocalDate(input.date);
        const customer = await findOrCreateCustomer({
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail,
        });

        const court = await prisma.court.findFirst({
            where: { id: input.courtId, venueId: input.venueId, status: 'ACTIVE' },
        });
        if (!court) {
            throw new AppError(404, 'Khong tim thay san kha dung');
        }

        const availability = await bookingService.checkAvailability(input.courtId, date, input.startTime, input.endTime);
        if (!availability.available) {
            throw new AppError(409, 'Khung gio nay da co nguoi dat', { conflicts: availability.conflicts });
        }
        if (!isFutureBookingStart(date, input.startTime)) {
            throw new AppError(400, 'Khong the dat khung gio da qua');
        }

        const pricing = await bookingService.calculatePrice(input.courtId, date, input.startTime, input.endTime);
        const addons = await resolveAddons(input.venueId, input.addons);
        const addonTotal = addons.reduce((sum, addon) => sum + addon.total, 0);
        const totalAmount = pricing.total + addonTotal;

        const booking = await prisma.booking.create({
            data: {
                courtId: input.courtId,
                customerId: customer.id,
                date,
                startTime: input.startTime,
                endTime: input.endTime,
                totalAmount,
                notes: addOnlineMeta(input.notes, addons),
                status: 'PENDING',
            },
            include: {
                court: { include: { venue: true } },
                customer: true,
            },
        });

        await prisma.customer.update({
            where: { id: customer.id },
            data: { totalBookings: { increment: 1 } },
        });

        return {
            booking: mapBooking(booking),
            pricing: {
                ...pricing,
                courtTotal: pricing.total,
                addonTotal,
                total: totalAmount,
            },
        };
    }

    async lookup(phoneInput: string) {
        const phone = normalizePhone(phoneInput);
        const customer = await prisma.customer.findUnique({
            where: { phone },
        });

        if (!customer) {
            return {
                customer: null,
                bookings: [],
                summary: {
                    points: 0,
                    totalBookings: 0,
                    totalSpent: 0,
                },
            };
        }

        const bookings = await prisma.booking.findMany({
            where: { customerId: customer.id },
            include: {
                court: { include: { venue: true } },
                customer: true,
            },
            orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        });

        return {
            customer,
            bookings: bookings.map(mapBooking),
            summary: {
                points: customer.points,
                totalBookings: customer.totalBookings,
                totalSpent: customer.totalSpent,
            },
        };
    }

    async findBooking(id: string) {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                court: { include: { venue: true } },
                customer: true,
            },
        });

        if (!booking) {
            throw new AppError(404, 'Khong tim thay lich dat');
        }

        return mapBooking(booking);
    }

    async reschedule(id: string, input: ReschedulePublicBookingInput) {
        const existing = await prisma.booking.findUnique({
            where: { id },
            include: { customer: true, court: { include: { venue: true } } },
        });

        if (!existing) {
            throw new AppError(404, 'Khong tim thay lich dat');
        }

        if (!existing.customer || existing.customer.phone !== normalizePhone(input.phone)) {
            throw new AppError(403, 'So dien thoai khong khop voi lich dat');
        }

        if (!['PENDING', 'CONFIRMED'].includes(existing.status)) {
            throw new AppError(400, 'Lich nay khong the doi');
        }

        if (!canChangeBooking(existing.date, existing.startTime)) {
            throw new AppError(400, 'Chi co the doi lich truoc gio choi toi thieu 2 gio');
        }

        const courtId = input.courtId || existing.courtId;
        const date = parseLocalDate(input.date);
        const availability = await bookingService.checkAvailability(courtId, date, input.startTime, input.endTime, id);
        if (!availability.available) {
            throw new AppError(409, 'Khung gio moi da co nguoi dat', { conflicts: availability.conflicts });
        }

        const pricing = await bookingService.calculatePrice(courtId, date, input.startTime, input.endTime);
        const meta = parseOnlineMeta(existing.notes);
        const addonTotal = meta.addons.reduce((sum, addon) => sum + addon.total, 0);
        const notes = addOnlineMeta(
            `${meta.publicNotes || ''}${input.reason ? `\n[Doi lich]: ${input.reason}` : ''}`.trim(),
            meta.addons
        );

        const booking = await prisma.booking.update({
            where: { id },
            data: {
                courtId,
                date,
                startTime: input.startTime,
                endTime: input.endTime,
                totalAmount: pricing.total + addonTotal,
                notes,
            },
            include: {
                court: { include: { venue: true } },
                customer: true,
            },
        });

        return mapBooking(booking);
    }

    async cancel(id: string, phoneInput: string, reason?: string) {
        const existing = await prisma.booking.findUnique({
            where: { id },
            include: { customer: true },
        });

        if (!existing) {
            throw new AppError(404, 'Khong tim thay lich dat');
        }

        if (!existing.customer || existing.customer.phone !== normalizePhone(phoneInput)) {
            throw new AppError(403, 'So dien thoai khong khop voi lich dat');
        }

        if (!['PENDING', 'CONFIRMED'].includes(existing.status)) {
            throw new AppError(400, 'Lich nay khong the huy');
        }

        if (!canChangeBooking(existing.date, existing.startTime)) {
            throw new AppError(400, 'Chi co the huy lich truoc gio choi toi thieu 2 gio');
        }

        const meta = parseOnlineMeta(existing.notes);
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                notes: addOnlineMeta(
                    `${meta.publicNotes || ''}${reason ? `\n[Huy online]: ${reason}` : ''}`.trim(),
                    meta.addons
                ),
            },
            include: {
                court: { include: { venue: true } },
                customer: true,
            },
        });

        return mapBooking(booking);
    }
}

export const publicBookingService = new PublicBookingService();
