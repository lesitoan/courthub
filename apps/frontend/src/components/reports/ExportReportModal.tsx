import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exportReport, type ExportOptions } from '@/services/export.service';

type ExportFormat = 'excel' | 'pdf' | 'csv';
type ReportType = 'revenue' | 'bookings' | 'customers' | 'inventory';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport?: (options: ExportOptions) => Promise<void>;
    availableReports?: ReportType[];
}


const REPORT_TYPES: { id: ReportType; label: string; description: string }[] = [
    { id: 'revenue', label: 'Báo cáo doanh thu', description: 'Tổng hợp doanh thu theo thời gian' },
    { id: 'bookings', label: 'Báo cáo đặt sân', description: 'Chi tiết các lượt đặt sân' },
    { id: 'customers', label: 'Báo cáo khách hàng', description: 'Danh sách và thống kê khách hàng' },
    { id: 'inventory', label: 'Báo cáo tồn kho', description: 'Xuất nhập tồn sản phẩm' },
];

const EXPORT_FORMATS: { id: ExportFormat; label: string; icon: typeof FileSpreadsheet; color: string }[] = [
    { id: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-green-500 bg-green-500/10' },
    { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500 bg-red-500/10' },
    { id: 'csv', label: 'CSV', icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
];

function getDefaultDateRange() {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}

export function ExportReportModal({
    isOpen,
    onClose,
    onExport,
    availableReports = ['revenue', 'bookings', 'customers', 'inventory'],
}: ExportReportModalProps) {
    const [reportType, setReportType] = useState<ReportType>('revenue');
    const [format, setFormat] = useState<ExportFormat>('excel');
    const [dateRange, setDateRange] = useState(getDefaultDateRange);
    const [includeDetails, setIncludeDetails] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const options = {
                reportType,
                format,
                dateRange,
                includeDetails,
            };

            if (onExport) {
                await onExport(options);
            } else {
                await exportReport(options);
            }
            onClose();
        } finally {
            setIsExporting(false);
        }
    };


    if (!isOpen) return null;

    const filteredReports = REPORT_TYPES.filter(r => availableReports.includes(r.id));

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg animate-scaleIn">
                <div className="bg-background-secondary rounded-2xl border border-border shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                <Download className="w-5 h-5 text-primary-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Xuất báo cáo</h2>
                                <p className="text-sm text-foreground-secondary">Chọn loại báo cáo và định dạng</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-6 max-h-[60vh] overflow-auto">
                        {/* Report Type */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Loại báo cáo
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {filteredReports.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setReportType(type.id)}
                                        className={cn(
                                            'p-3 rounded-lg border text-left transition-all',
                                            reportType === type.id
                                                ? 'bg-primary-500/10 border-primary-500 text-primary-500'
                                                : 'bg-background-tertiary border-border hover:border-primary-500/50'
                                        )}
                                    >
                                        <p className="font-medium">{type.label}</p>
                                        <p className="text-xs opacity-70 mt-0.5">{type.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Khoảng thời gian
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-foreground-muted mb-1">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                        className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-foreground-muted mb-1">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Format */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Định dạng xuất</label>
                            <div className="flex gap-2">
                                {EXPORT_FORMATS.map((f) => {
                                    const Icon = f.icon;
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all',
                                                format === f.id
                                                    ? `${f.color} border-current`
                                                    : 'bg-background-tertiary border-border hover:border-foreground-muted'
                                            )}
                                        >
                                            <Icon className={cn('w-5 h-5', format === f.id ? '' : 'opacity-50')} />
                                            <span className="font-medium text-sm">{f.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Options */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeDetails}
                                    onChange={(e) => setIncludeDetails(e.target.checked)}
                                    className="w-4 h-4 rounded border-border bg-background-tertiary text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm">Bao gồm chi tiết giao dịch</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t border-border">
                        <Button variant="ghost" className="flex-1" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            className="flex-1 gap-2"
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

// Quick export button
export function ExportButton({ onClick, label = 'Xuất báo cáo' }: { onClick: () => void; label?: string }) {
    return (
        <Button variant="outline" className="gap-2" onClick={onClick}>
            <Download className="w-4 h-4" />
            {label}
        </Button>
    );
}
