import { formatCurrency } from '@/lib/utils';

interface InvoiceItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate?: string;
    customer: {
        name: string;
        phone: string;
        email?: string;
        address?: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    tax?: number;
    total: number;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'cancelled' | 'refunded';
    notes?: string;
    venue: {
        name: string;
        address: string;
        phone: string;
        email?: string;
        taxId?: string;
    };
}

// Generate printable invoice HTML
export function generateInvoiceHTML(data: InvoiceData): string {
    const statusColors = {
        pending: '#f59e0b',
        paid: '#22c55e',
        cancelled: '#ef4444',
        refunded: '#8b5cf6',
    };

    const statusLabels = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        cancelled: 'Đã hủy',
        refunded: 'Đã hoàn tiền',
    };

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hóa đơn ${data.invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            color: #1f2937;
            background: #fff;
            padding: 40px;
        }
        .invoice { max-width: 800px; margin: 0 auto; }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        .logo h1 {
            font-size: 28px;
            color: #2563eb;
            margin-bottom: 8px;
        }
        .logo p { color: #6b7280; font-size: 13px; }
        .invoice-info { text-align: right; }
        .invoice-info h2 {
            font-size: 24px;
            color: #374151;
            margin-bottom: 8px;
        }
        .invoice-number { font-size: 16px; color: #6b7280; }
        .invoice-date { margin-top: 4px; color: #6b7280; }
        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            margin-top: 8px;
            color: white;
            background: ${statusColors[data.paymentStatus]};
        }
        .parties {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .party { flex: 1; }
        .party h3 {
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        .party p { margin-bottom: 4px; }
        .party .name { font-weight: 600; font-size: 16px; color: #111827; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th {
            background: #f3f4f6;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }
        th:last-child, td:last-child { text-align: right; }
        td {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
        }
        .item-name { font-weight: 500; }
        .totals {
            display: flex;
            justify-content: flex-end;
        }
        .totals-table {
            width: 300px;
        }
        .totals-table tr td {
            padding: 8px 16px;
            border: none;
        }
        .totals-table tr:last-child td {
            font-size: 18px;
            font-weight: 700;
            color: #2563eb;
            border-top: 2px solid #e5e7eb;
            padding-top: 16px;
        }
        .discount { color: #22c55e; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .notes {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .notes h4 { margin-bottom: 8px; color: #374151; }
        .payment-info {
            margin-top: 30px;
            padding: 16px;
            background: #eff6ff;
            border-radius: 8px;
        }
        .payment-info h4 { color: #2563eb; margin-bottom: 8px; }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="logo">
                <h1>🏸 ${data.venue.name}</h1>
                <p>${data.venue.address}</p>
                <p>ĐT: ${data.venue.phone}${data.venue.email ? ` | ${data.venue.email}` : ''}</p>
                ${data.venue.taxId ? `<p>MST: ${data.venue.taxId}</p>` : ''}
            </div>
            <div class="invoice-info">
                <h2>HÓA ĐƠN</h2>
                <p class="invoice-number">#${data.invoiceNumber}</p>
                <p class="invoice-date">Ngày: ${data.date}</p>
                ${data.dueDate ? `<p class="invoice-date">Hạn thanh toán: ${data.dueDate}</p>` : ''}
                <span class="status">${statusLabels[data.paymentStatus]}</span>
            </div>
        </div>

        <div class="parties">
            <div class="party">
                <h3>Thông tin khách hàng</h3>
                <p class="name">${data.customer.name}</p>
                <p>SĐT: ${data.customer.phone}</p>
                ${data.customer.email ? `<p>Email: ${data.customer.email}</p>` : ''}
                ${data.customer.address ? `<p>Địa chỉ: ${data.customer.address}</p>` : ''}
            </div>
            <div class="party">
                <h3>Phương thức thanh toán</h3>
                <p class="name">${data.paymentMethod}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50%">Mô tả</th>
                    <th style="width: 15%">Số lượng</th>
                    <th style="width: 17%">Đơn giá</th>
                    <th style="width: 18%">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                <tr>
                    <td class="item-name">${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.unitPrice)}</td>
                    <td>${formatCurrency(item.total)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td>Tạm tính</td>
                    <td>${formatCurrency(data.subtotal)}</td>
                </tr>
                ${data.discount > 0 ? `
                <tr>
                    <td>Giảm giá</td>
                    <td class="discount">-${formatCurrency(data.discount)}</td>
                </tr>
                ` : ''}
                ${data.tax ? `
                <tr>
                    <td>Thuế VAT (10%)</td>
                    <td>${formatCurrency(data.tax)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td>TỔNG CỘNG</td>
                    <td>${formatCurrency(data.total)}</td>
                </tr>
            </table>
        </div>

        ${data.notes ? `
        <div class="notes">
            <h4>Ghi chú</h4>
            <p>${data.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p style="margin-top: 8px">Mọi thắc mắc xin liên hệ: ${data.venue.phone}</p>
        </div>
    </div>

    <script>
        // Auto print when opened
        window.onload = function() {
            // window.print();
        };
    </script>
</body>
</html>
`;
}

// Open invoice in new window for printing
export function printInvoice(data: InvoiceData): void {
    const html = generateInvoiceHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        // Delay print to allow styles to load
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}

// Download invoice as PDF (using browser print to PDF)
export function downloadInvoiceAsPDF(data: InvoiceData): void {
    const html = generateInvoiceHTML(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        // Show print dialog allowing user to save as PDF
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}
