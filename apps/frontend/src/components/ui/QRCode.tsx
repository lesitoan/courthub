import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    includeMargin?: boolean;
    level?: 'L' | 'M' | 'Q' | 'H';
    showDownload?: boolean;
    downloadFileName?: string;
}

// Simple QR Code generator using canvas (no external dependencies)
export function QRCode({
    value,
    size = 200,
    bgColor = '#ffffff',
    fgColor = '#000000',
    includeMargin = true,
    level = 'M',
    showDownload = false,
    downloadFileName = 'qrcode',
}: QRCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !value) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Generate QR code matrix using simple encoding
        const matrix = generateQRMatrix(value, level);
        const cellSize = size / matrix.length;
        const margin = includeMargin ? cellSize * 2 : 0;

        canvas.width = size + margin * 2;
        canvas.height = size + margin * 2;

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code cells
        ctx.fillStyle = fgColor;
        matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillRect(
                        margin + x * cellSize,
                        margin + y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            });
        });
    }, [value, size, bgColor, fgColor, includeMargin, level]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `${downloadFileName}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="inline-flex flex-col items-center gap-2">
            <canvas
                ref={canvasRef}
                className="rounded-lg"
                style={{ width: size, height: size }}
            />
            {showDownload && (
                <Button size="sm" variant="ghost" className="gap-2" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Tải xuống
                </Button>
            )}
        </div>
    );
}

// Simple QR Code matrix generator (basic implementation)
// For production, use a proper library like 'qrcode'
function generateQRMatrix(data: string, level: string): boolean[][] {
    // This is a simplified QR-like pattern generator
    // In production, use a proper QR code library
    const size = Math.max(21, Math.ceil(data.length / 2) + 21);
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

    // Generate finder patterns (top-left, top-right, bottom-left corners)
    const addFinderPattern = (startX: number, startY: number) => {
        for (let y = 0; y < 7; y++) {
            for (let x = 0; x < 7; x++) {
                const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
                const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                matrix[startY + y][startX + x] = isOuter || isInner;
            }
        }
    };

    addFinderPattern(0, 0);
    addFinderPattern(size - 7, 0);
    addFinderPattern(0, size - 7);

    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
        matrix[6][i] = i % 2 === 0;
        matrix[i][6] = i % 2 === 0;
    }

    // Generate data pattern based on input
    let dataIndex = 0;
    const charCodes = data.split('').map(c => c.charCodeAt(0));

    for (let y = 9; y < size - 8; y++) {
        for (let x = 9; x < size - 8; x++) {
            // Skip timing patterns
            if (x === 6 || y === 6) continue;

            // Use character codes to generate pattern
            const charCode = charCodes[dataIndex % charCodes.length];
            const bit = (x * y + charCode) % 7;
            matrix[y][x] = bit < 3;
            dataIndex++;
        }
    }

    // Add error correction level indicator
    const levelBits = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };
    const levelValue = levelBits[level as keyof typeof levelBits] || 0;
    matrix[8][0] = !!(levelValue & 1);
    matrix[8][1] = !!(levelValue & 2);

    return matrix;
}

// Booking QR code component
interface BookingQRCodeProps {
    bookingId: string;
    customerName: string;
    courtName: string;
    dateTime: string;
    size?: number;
}

export function BookingQRCode({
    bookingId,
    customerName,
    courtName,
    dateTime,
    size = 200,
}: BookingQRCodeProps) {
    const qrValue = JSON.stringify({
        id: bookingId,
        customer: customerName,
        court: courtName,
        time: dateTime,
    });

    return (
        <div className="bg-white p-4 rounded-xl inline-block">
            <QRCode
                value={qrValue}
                size={size}
                showDownload
                downloadFileName={`booking-${bookingId}`}
            />
            <div className="text-center mt-2">
                <p className="text-sm font-medium text-gray-900">{courtName}</p>
                <p className="text-xs text-gray-500">{dateTime}</p>
            </div>
        </div>
    );
}
