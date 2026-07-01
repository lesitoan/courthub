// Notification service types and placeholder implementations
// In production, these would connect to SMS (Twilio, etc.) and Email (SendGrid, etc.) APIs

export type NotificationChannel = 'email' | 'sms' | 'push' | 'inApp';
export type NotificationType =
    | 'booking_confirmation'
    | 'booking_reminder'
    | 'booking_cancelled'
    | 'payment_received'
    | 'payment_reminder'
    | 'low_stock_alert'
    | 'daily_report'
    | 'shift_handover';

interface NotificationRecipient {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    pushToken?: string;
}

interface NotificationPayload {
    type: NotificationType;
    recipient: NotificationRecipient;
    channels: NotificationChannel[];
    data: Record<string, unknown>;
    scheduledFor?: Date;
}

interface NotificationResult {
    success: boolean;
    channel: NotificationChannel;
    messageId?: string;
    error?: string;
}

// Notification templates
const templates: Record<NotificationType, { subject: string; body: string }> = {
    booking_confirmation: {
        subject: 'Xác nhận đặt sân - {venueName}',
        body: `Kính gửi {customerName},

Cảm ơn bạn đã đặt sân tại {venueName}!

Chi tiết đặt sân:
- Sân: {courtName}
- Ngày: {date}
- Giờ: {startTime} - {endTime}
- Tổng tiền: {amount}

Vui lòng đến trước 10 phút để check-in.

Trân trọng,
{venueName}`,
    },
    booking_reminder: {
        subject: 'Nhắc nhở lịch đặt sân - {venueName}',
        body: `Kính gửi {customerName},

Đây là nhắc nhở về lịch đặt sân của bạn:

- Sân: {courtName}
- Thời gian: {startTime} - {endTime}
- Còn: {hoursUntil} giờ nữa

Hẹn gặp bạn tại {venueName}!`,
    },
    booking_cancelled: {
        subject: 'Thông báo hủy lịch đặt sân',
        body: `Kính gửi {customerName},

Lịch đặt sân của bạn đã được hủy:
- Sân: {courtName}
- Ngày: {date}
- Giờ: {startTime} - {endTime}

Lý do: {reason}

Nếu có thắc mắc, vui lòng liên hệ: {venuePhone}`,
    },
    payment_received: {
        subject: 'Xác nhận thanh toán - {venueName}',
        body: `Kính gửi {customerName},

Cảm ơn bạn! Chúng tôi đã nhận được thanh toán:
- Số tiền: {amount}
- Phương thức: {paymentMethod}
- Mã giao dịch: {transactionId}

Cảm ơn đã sử dụng dịch vụ của {venueName}!`,
    },
    payment_reminder: {
        subject: 'Nhắc nhở thanh toán - {venueName}',
        body: `Kính gửi {customerName},

Bạn có hóa đơn chưa thanh toán:
- Số hóa đơn: {invoiceNumber}
- Số tiền: {amount}
- Hạn thanh toán: {dueDate}

Vui lòng thanh toán để tránh gián đoạn dịch vụ.`,
    },
    low_stock_alert: {
        subject: '⚠️ Cảnh báo tồn kho thấp',
        body: `Các sản phẩm sau đây sắp hết hàng:

{productList}

Vui lòng nhập thêm hàng để tránh thiếu hụt.`,
    },
    daily_report: {
        subject: '📊 Báo cáo hàng ngày - {date}',
        body: `Xin chào,

Đây là tóm tắt hoạt động ngày {date}:

📅 Đặt sân: {totalBookings} lượt
💰 Doanh thu: {totalRevenue}
👥 Khách mới: {newCustomers}
🏸 Tỷ lệ sử dụng: {courtUsage}%

Chi tiết xem tại hệ thống quản lý.`,
    },
    shift_handover: {
        subject: '📝 Bàn giao ca - {shiftTime}',
        body: `Ghi chú bàn giao ca {shiftTime}:

{notes}

Người bàn giao: {handoverBy}`,
    },
};

// Template interpolation
function interpolateTemplate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) =>
        String(data[key] ?? `{${key}}`)
    );
}

// Simulated notification sending functions
async function sendEmail(
    to: string,
    subject: string,
    body: string
): Promise<NotificationResult> {
    // In production: integrate with SendGrid, Mailgun, SES, etc.
    console.log(`[EMAIL] To: ${to}\nSubject: ${subject}\nBody: ${body}`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        channel: 'email',
        messageId: `email_${Date.now()}`,
    };
}

async function sendSMS(to: string, message: string): Promise<NotificationResult> {
    // In production: integrate with Twilio, Nexmo, Vonage, etc.
    console.log(`[SMS] To: ${to}\nMessage: ${message}`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        success: true,
        channel: 'sms',
        messageId: `sms_${Date.now()}`,
    };
}

async function sendPush(token: string, title: string, body: string): Promise<NotificationResult> {
    // In production: integrate with Firebase Cloud Messaging, OneSignal, etc.
    console.log(`[PUSH] Token: ${token}\nTitle: ${title}\nBody: ${body}`);

    await new Promise(resolve => setTimeout(resolve, 200));

    return {
        success: true,
        channel: 'push',
        messageId: `push_${Date.now()}`,
    };
}

// Main notification service
export const notificationService = {
    async send(payload: NotificationPayload): Promise<NotificationResult[]> {
        const template = templates[payload.type];
        if (!template) {
            return [{
                success: false,
                channel: 'email',
                error: `Unknown notification type: ${payload.type}`,
            }];
        }

        const subject = interpolateTemplate(template.subject, payload.data);
        const body = interpolateTemplate(template.body, payload.data);
        const results: NotificationResult[] = [];

        for (const channel of payload.channels) {
            try {
                let result: NotificationResult;

                switch (channel) {
                    case 'email':
                        if (!payload.recipient.email) {
                            result = { success: false, channel, error: 'No email address' };
                        } else {
                            result = await sendEmail(payload.recipient.email, subject, body);
                        }
                        break;

                    case 'sms':
                        if (!payload.recipient.phone) {
                            result = { success: false, channel, error: 'No phone number' };
                        } else {
                            // SMS uses shortened body
                            const smsBody = body.slice(0, 160);
                            result = await sendSMS(payload.recipient.phone, smsBody);
                        }
                        break;

                    case 'push':
                        if (!payload.recipient.pushToken) {
                            result = { success: false, channel, error: 'No push token' };
                        } else {
                            result = await sendPush(payload.recipient.pushToken, subject, body.slice(0, 100));
                        }
                        break;

                    case 'inApp':
                        // Store in database for in-app notification center
                        console.log(`[IN-APP] User: ${payload.recipient.id}\nTitle: ${subject}\nBody: ${body.slice(0, 200)}`);
                        result = { success: true, channel, messageId: `inapp_${Date.now()}` };
                        break;

                    default:
                        result = { success: false, channel, error: 'Unknown channel' };
                }

                results.push(result);
            } catch (error) {
                results.push({
                    success: false,
                    channel,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return results;
    },

    // Convenience methods
    async sendBookingConfirmation(
        recipient: NotificationRecipient,
        bookingData: {
            venueName: string;
            courtName: string;
            date: string;
            startTime: string;
            endTime: string;
            amount: string;
        }
    ) {
        return this.send({
            type: 'booking_confirmation',
            recipient,
            channels: ['email', 'sms'],
            data: { ...bookingData, customerName: recipient.name },
        });
    },

    async sendBookingReminder(
        recipient: NotificationRecipient,
        bookingData: {
            venueName: string;
            courtName: string;
            startTime: string;
            endTime: string;
            hoursUntil: number;
        }
    ) {
        return this.send({
            type: 'booking_reminder',
            recipient,
            channels: ['sms', 'push'],
            data: { ...bookingData, customerName: recipient.name },
        });
    },

    async sendPaymentConfirmation(
        recipient: NotificationRecipient,
        paymentData: {
            venueName: string;
            amount: string;
            paymentMethod: string;
            transactionId: string;
        }
    ) {
        return this.send({
            type: 'payment_received',
            recipient,
            channels: ['email'],
            data: { ...paymentData, customerName: recipient.name },
        });
    },

    async sendLowStockAlert(
        recipient: NotificationRecipient,
        products: { name: string; quantity: number }[]
    ) {
        const productList = products
            .map(p => `- ${p.name}: ${p.quantity} còn lại`)
            .join('\n');

        return this.send({
            type: 'low_stock_alert',
            recipient,
            channels: ['email', 'inApp'],
            data: { productList },
        });
    },

    async sendDailyReport(
        recipient: NotificationRecipient,
        reportData: {
            date: string;
            totalBookings: number;
            totalRevenue: string;
            newCustomers: number;
            courtUsage: number;
        }
    ) {
        return this.send({
            type: 'daily_report',
            recipient,
            channels: ['email'],
            data: reportData,
        });
    },
};

export default notificationService;
