import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '@/services/invoice.service';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PrintInvoicePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isPrinting, setIsPrinting] = useState(false);

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ['invoice', id],
        queryFn: () => invoiceApi.getById(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (invoice && !isPrinting) {
            setIsPrinting(true);
            // Delay print to ensure rendering is complete
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [invoice, isPrinting]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-red-500">Không tìm thấy hóa đơn</p>
                <button onClick={() => navigate('/invoices')} className="text-primary-500 hover:underline">
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-invoice, #print-invoice * {
                        visibility: visible;
                    }
                    #print-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Back button - hidden when printing */}
            <div className="no-print fixed top-4 left-4 z-50">
                <button
                    onClick={() => navigate('/invoices')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                    ← Quay lại
                </button>
            </div>

            {/* Invoice Content */}
            <div id="print-invoice" className="max-w-3xl mx-auto p-8 bg-white text-black">
                {/* Header */}
                <div className="flex items-start justify-between border-b-2 border-gray-200 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-600">COURTIFY</h1>
                        <p className="text-gray-600 mt-1">Hệ thống quản lý sân cầu lông</p>
                        <div className="mt-2 text-sm text-gray-500">
                            <p>123 Phan Xích Long, Phú Nhuận, TP.HCM</p>
                            <p>Hotline: 028 1234 5678</p>
                            <p>Email: info@courtify.vn</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800">HÓA ĐƠN</h2>
                        <p className="text-lg font-mono text-gray-600">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Ngày: {formatDate(new Date(invoice.createdAt))}
                        </p>
                        {invoice.paidAt && (
                            <p className="text-sm text-green-600">
                                Thanh toán: {formatDate(new Date(invoice.paidAt))}
                            </p>
                        )}
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin khách hàng</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Họ tên:</span>
                            <span className="ml-2 font-medium">{invoice.customer?.name || 'Khách lẻ'}</span>
                        </div>
                        {invoice.customer?.phone && (
                            <div>
                                <span className="text-gray-500">Số điện thoại:</span>
                                <span className="ml-2 font-medium">{invoice.customer.phone}</span>
                            </div>
                        )}
                        {invoice.customer?.membershipTier && (
                            <div>
                                <span className="text-gray-500">Hội viên:</span>
                                <span className="ml-2 font-medium">{invoice.customer.membershipTier}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-6">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 font-semibold text-gray-700">Mô tả</th>
                            <th className="text-center py-3 font-semibold text-gray-700 w-20">SL</th>
                            <th className="text-right py-3 font-semibold text-gray-700 w-32">Đơn giá</th>
                            <th className="text-right py-3 font-semibold text-gray-700 w-32">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-3 px-2">{item.description}</td>
                                <td className="py-3 px-2 text-center">{item.quantity}</td>
                                <td className="py-3 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                <td className="py-3 px-2 text-right font-medium">{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-end">
                        <div className="w-80">
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-600">Tạm tính:</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount > 0 && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-600">Giảm giá:</span>
                                    <span className="text-red-600">-{formatCurrency(invoice.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-200 mt-2">
                                <span>Tổng cộng:</span>
                                <span className="text-primary-600">{formatCurrency(invoice.total)}</span>
                            </div>
                            {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
                                <>
                                    <div className="flex justify-between py-2 text-sm">
                                        <span className="text-gray-600">Đã thanh toán:</span>
                                        <span className="text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-sm font-medium">
                                        <span className="text-gray-600">Còn lại:</span>
                                        <span className="text-red-600">{formatCurrency(invoice.total - invoice.paidAmount)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="mt-6 p-4 rounded-lg border-2 text-center" style={{
                    borderColor: invoice.paymentStatus === 'PAID' ? '#22c55e' : invoice.paymentStatus === 'PARTIAL' ? '#f59e0b' : '#ef4444',
                    backgroundColor: invoice.paymentStatus === 'PAID' ? '#f0fdf4' : invoice.paymentStatus === 'PARTIAL' ? '#fffbeb' : '#fef2f2',
                }}>
                    <span className="text-lg font-bold" style={{
                        color: invoice.paymentStatus === 'PAID' ? '#16a34a' : invoice.paymentStatus === 'PARTIAL' ? '#d97706' : '#dc2626',
                    }}>
                        {invoice.paymentStatus === 'PAID' && '✓ ĐÃ THANH TOÁN'}
                        {invoice.paymentStatus === 'PARTIAL' && '⏳ THANH TOÁN MỘT PHẦN'}
                        {invoice.paymentStatus === 'PENDING' && '⏳ CHƯA THANH TOÁN'}
                        {invoice.paymentStatus === 'REFUNDED' && '↩ ĐÃ HOÀN TIỀN'}
                    </span>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Ghi chú</h3>
                        <p className="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>Cảm ơn quý khách đã sử dụng dịch vụ của Courtify!</p>
                    <p className="mt-1">Mọi thắc mắc xin liên hệ: 028 1234 5678 | info@courtify.vn</p>
                </div>
            </div>
        </>
    );
}
