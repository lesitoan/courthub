// Export Service - Client-side file generation
// Vì chưa có backend API, ta sẽ generate file trực tiếp ở client

export interface ExportOptions {
    reportType: 'revenue' | 'bookings' | 'customers' | 'inventory';
    format: 'excel' | 'pdf' | 'csv';
    dateRange: {
        start: string;
        end: string;
    };
    includeDetails?: boolean;
}

// Mock data generators
function generateMockRevenueData(dateRange: { start: string; end: string }) {
    const data = [];
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        data.push({
            date: d.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 5000000) + 500000,
            bookings: Math.floor(Math.random() * 20) + 5,
            courtUsage: Math.floor(Math.random() * 40) + 60,
        });
    }
    return data;
}

function generateMockBookingsData() {
    const statuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'];
    const courts = ['Sân A1', 'Sân A2', 'Sân B1', 'Sân B2', 'Sân C1'];
    const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];

    return Array.from({ length: 20 }, (_, i) => ({
        id: `BK-2026-${String(i + 1).padStart(4, '0')}`,
        customer: names[Math.floor(Math.random() * names.length)],
        court: courts[Math.floor(Math.random() * courts.length)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 8) + 8}:00 - ${Math.floor(Math.random() * 8) + 12}:00`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        amount: Math.floor(Math.random() * 300000) + 100000,
    }));
}

function generateMockCustomersData() {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Vũ Thị F', 'Đặng Văn G'];

    return names.map((name, index) => ({
        id: `CUS-${String(index + 1).padStart(4, '0')}`,
        name,
        phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        email: `${name.toLowerCase().replace(/\s/g, '.')}@email.com`,
        tier: tiers[Math.floor(Math.random() * tiers.length)],
        totalBookings: Math.floor(Math.random() * 50) + 1,
        totalSpent: Math.floor(Math.random() * 10000000) + 500000,
        lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
}

function generateMockInventoryData() {
    const products = [
        { name: 'Cầu lông Yonex AS-50', sku: 'YNX-AS50', category: 'Cầu lông' },
        { name: 'Vợt cầu lông Lining N7II', sku: 'LN-N7II', category: 'Vợt' },
        { name: 'Băng cuốn cán Victor GR262', sku: 'VIC-GR262', category: 'Phụ kiện' },
        { name: 'Nước suối Aquafina 500ml', sku: 'AQF-500', category: 'Đồ uống' },
        { name: 'Khăn thể thao Nike', sku: 'NKE-TWL', category: 'Phụ kiện' },
    ];

    return products.map((p) => ({
        ...p,
        quantity: Math.floor(Math.random() * 100),
        price: Math.floor(Math.random() * 500000) + 20000,
        cost: Math.floor(Math.random() * 300000) + 10000,
        lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
}

// CSV Generation
function generateCSV(headers: string[], rows: (string | number)[][]): string {
    const BOM = '\uFEFF'; // UTF-8 BOM for Excel
    const headerRow = headers.join(',');
    const dataRows = rows.map(row =>
        row.map(cell => {
            const str = String(cell);
            // Escape quotes and wrap in quotes if contains comma
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    );
    return BOM + [headerRow, ...dataRows].join('\n');
}

// Generate and download file
function downloadFile(content: string | Blob, filename: string, mimeType: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Format currency for export
function formatCurrencyForExport(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
}

// Main export function
export async function exportReport(options: ExportOptions): Promise<void> {
    const { reportType, format, dateRange } = options;
    const timestamp = new Date().toISOString().slice(0, 10);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (reportType) {
        case 'revenue': {
            const data = generateMockRevenueData(dateRange);
            const headers = ['Ngày', 'Doanh thu', 'Số lượt đặt', 'Tỷ lệ sử dụng sân (%)'];
            const rows = data.map(d => [d.date, formatCurrencyForExport(d.revenue), d.bookings, d.courtUsage]);

            if (format === 'csv' || format === 'excel') {
                content = generateCSV(headers, rows);
                filename = `bao-cao-doanh-thu_${timestamp}.csv`;
                mimeType = 'text/csv;charset=utf-8';
            } else {
                content = generatePDFContent('Báo cáo Doanh thu', headers, rows, dateRange);
                filename = `bao-cao-doanh-thu_${timestamp}.html`;
                mimeType = 'text/html;charset=utf-8';
            }
            break;
        }

        case 'bookings': {
            const data = generateMockBookingsData();
            const headers = ['Mã đặt sân', 'Khách hàng', 'Sân', 'Ngày', 'Giờ', 'Trạng thái', 'Số tiền'];
            const rows = data.map(d => [d.id, d.customer, d.court, d.date, d.time, d.status, formatCurrencyForExport(d.amount)]);

            if (format === 'csv' || format === 'excel') {
                content = generateCSV(headers, rows);
                filename = `bao-cao-dat-san_${timestamp}.csv`;
                mimeType = 'text/csv;charset=utf-8';
            } else {
                content = generatePDFContent('Báo cáo Đặt sân', headers, rows, dateRange);
                filename = `bao-cao-dat-san_${timestamp}.html`;
                mimeType = 'text/html;charset=utf-8';
            }
            break;
        }

        case 'customers': {
            const data = generateMockCustomersData();
            const headers = ['Mã KH', 'Họ tên', 'Điện thoại', 'Email', 'Hạng', 'Tổng lượt đặt', 'Tổng chi tiêu', 'Lần cuối'];
            const rows = data.map(d => [d.id, d.name, d.phone, d.email, d.tier, d.totalBookings, formatCurrencyForExport(d.totalSpent), d.lastVisit]);

            if (format === 'csv' || format === 'excel') {
                content = generateCSV(headers, rows);
                filename = `bao-cao-khach-hang_${timestamp}.csv`;
                mimeType = 'text/csv;charset=utf-8';
            } else {
                content = generatePDFContent('Báo cáo Khách hàng', headers, rows, dateRange);
                filename = `bao-cao-khach-hang_${timestamp}.html`;
                mimeType = 'text/html;charset=utf-8';
            }
            break;
        }

        case 'inventory': {
            const data = generateMockInventoryData();
            const headers = ['Tên sản phẩm', 'Mã SKU', 'Danh mục', 'Số lượng', 'Giá bán', 'Giá nhập', 'Nhập cuối'];
            const rows = data.map(d => [d.name, d.sku, d.category, d.quantity, formatCurrencyForExport(d.price), formatCurrencyForExport(d.cost), d.lastRestocked]);

            if (format === 'csv' || format === 'excel') {
                content = generateCSV(headers, rows);
                filename = `bao-cao-ton-kho_${timestamp}.csv`;
                mimeType = 'text/csv;charset=utf-8';
            } else {
                content = generatePDFContent('Báo cáo Tồn kho', headers, rows, dateRange);
                filename = `bao-cao-ton-kho_${timestamp}.html`;
                mimeType = 'text/html;charset=utf-8';
            }
            break;
        }

        default:
            throw new Error(`Unsupported report type: ${reportType}`);
    }

    downloadFile(content, filename, mimeType);
}

// Generate printable HTML for PDF
function generatePDFContent(
    title: string,
    headers: string[],
    rows: (string | number)[][],
    dateRange: { start: string; end: string }
): string {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 40px;
            color: #1a1a2e;
            background: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #6366f1;
        }
        .header h1 {
            font-size: 28px;
            color: #6366f1;
            margin-bottom: 8px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 13px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            font-size: 13px;
        }
        td {
            font-size: 13px;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
        }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏸 ${title}</h1>
        <p>Hệ thống Quản lý Sân Cầu Lông</p>
    </div>
    
    <div class="meta">
        <span>Từ: ${dateRange.start} - Đến: ${dateRange.end}</span>
        <span>Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}</span>
    </div>
    
    <table>
        <thead>
            <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <p>Báo cáo được tạo tự động bởi CourtHub - Hệ thống Quản lý Sân Cầu Lông</p>
    </div>
    
    <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 30px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            🖨️ In báo cáo / Lưu PDF
        </button>
    </div>
</body>
</html>
    `.trim();
}

// Legacy API compatibility
export const exportApi = {
    async exportInvoices(params?: { startDate?: string; endDate?: string; status?: string }): Promise<void> {
        await exportReport({
            reportType: 'bookings',
            format: 'csv',
            dateRange: {
                start: params?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end: params?.endDate || new Date().toISOString().split('T')[0],
            },
        });
    },

    async exportBookings(params?: { startDate?: string; endDate?: string; status?: string }): Promise<void> {
        await exportReport({
            reportType: 'bookings',
            format: 'csv',
            dateRange: {
                start: params?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end: params?.endDate || new Date().toISOString().split('T')[0],
            },
        });
    },

    async exportCustomers(): Promise<void> {
        await exportReport({
            reportType: 'customers',
            format: 'csv',
            dateRange: {
                start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
            },
        });
    },

    async exportRevenueReport(month?: string): Promise<void> {
        const now = new Date();
        const start = month
            ? new Date(`${month}-01`)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

        await exportReport({
            reportType: 'revenue',
            format: 'csv',
            dateRange: {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0],
            },
        });
    },
};
