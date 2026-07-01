export interface BookingAddonMeta {
    type: 'product' | 'service';
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    total: number;
}

export interface BookingOnlineMeta {
    source?: string;
    publicNotes?: string;
    addons: BookingAddonMeta[];
}

const ONLINE_BOOKING_MARKER = '[ONLINE_BOOKING_META]';

export function parseBookingOnlineMeta(notes?: string | null): BookingOnlineMeta {
    if (!notes?.includes(ONLINE_BOOKING_MARKER)) {
        return {
            publicNotes: notes || undefined,
            addons: [],
        };
    }

    const [publicNotes, rawMeta] = notes.split(ONLINE_BOOKING_MARKER);
    try {
        const meta = JSON.parse(rawMeta || '{}');
        return {
            publicNotes: publicNotes.trim() || undefined,
            source: meta.source,
            addons: Array.isArray(meta.addons) ? meta.addons : [],
        };
    } catch {
        return {
            publicNotes: publicNotes.trim() || undefined,
            addons: [],
        };
    }
}

export function isOnlineBooking(notes?: string | null) {
    return notes?.includes(ONLINE_BOOKING_MARKER) || false;
}
