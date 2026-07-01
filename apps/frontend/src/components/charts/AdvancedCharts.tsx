import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LineChartProps {
    data: { label: string; value: number }[];
    height?: number;
    color?: string;
    showDots?: boolean;
    showArea?: boolean;
    showLabels?: boolean;
}

interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
    showLegend?: boolean;
    donut?: boolean;
}

// ==================== LINE CHART ====================

export function LineChart({
    data,
    height = 200,
    color = '#22c55e',
    showDots = true,
    showArea = true,
    showLabels = true,
}: LineChartProps) {
    const { points, pathD, areaD } = useMemo(() => {
        if (data.length === 0) return { points: [], pathD: '', areaD: '', minValue: 0, maxValue: 0 };

        const values = data.map(d => d.value);
        const min = Math.min(...values) * 0.9;
        const max = Math.max(...values) * 1.1;
        const range = max - min || 1;

        const padding = 30;
        const width = 100; // percent
        const usableHeight = height - padding * 2;

        const pts = data.map((d, i) => ({
            x: (i / (data.length - 1)) * (width - 10) + 5,
            y: padding + usableHeight - ((d.value - min) / range) * usableHeight,
            value: d.value,
            label: d.label,
        }));

        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const area = path + ` L ${pts[pts.length - 1].x} ${height - padding} L ${pts[0].x} ${height - padding} Z`;

        return { points: pts, pathD: path, areaD: area, minValue: min, maxValue: max };
    }, [data, height]);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center text-foreground-muted" style={{ height }}>
                Không có dữ liệu
            </div>
        );
    }

    return (
        <div className="relative" style={{ height }}>
            <svg
                viewBox={`0 0 100 ${height}`}
                preserveAspectRatio="none"
                className="w-full h-full"
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1="5"
                        y1={30 + (height - 60) * ratio}
                        x2="95"
                        y2={30 + (height - 60) * ratio}
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="0.3"
                    />
                ))}

                {/* Area fill */}
                {showArea && (
                    <path
                        d={areaD}
                        fill={color}
                        fillOpacity="0.1"
                    />
                )}

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Dots */}
                {showDots && points.map((p, i) => (
                    <g key={i}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="1.5"
                            fill={color}
                            className="transition-all hover:r-2"
                        />
                        {/* Tooltip trigger area */}
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            fill="transparent"
                            className="cursor-pointer"
                        >
                            <title>{p.label}: {p.value.toLocaleString('vi-VN')}</title>
                        </circle>
                    </g>
                ))}
            </svg>

            {/* X-axis labels */}
            {showLabels && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-foreground-muted">
                    {data.filter((_, i) => i % Math.ceil(data.length / 7) === 0 || i === data.length - 1).map((d, i) => (
                        <span key={i}>{d.label}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== PIE CHART ====================

export function PieChart({
    data,
    size = 200,
    showLegend = true,
    donut = false,
}: PieChartProps) {
    const { slices, total } = useMemo(() => {
        const sum = data.reduce((acc, d) => acc + d.value, 0);
        let currentAngle = -90; // Start from top

        const segments = data.map((d) => {
            const percentage = (d.value / sum) * 100;
            const angle = (d.value / sum) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            return {
                ...d,
                percentage,
                startAngle,
                endAngle,
            };
        });

        return { slices: segments, total: sum };
    }, [data]);

    const center = size / 2;
    const radius = size / 2 - 10;
    const innerRadius = donut ? radius * 0.6 : 0;

    function polarToCartesian(angle: number, r: number) {
        const rad = (angle * Math.PI) / 180;
        return {
            x: center + r * Math.cos(rad),
            y: center + r * Math.sin(rad),
        };
    }

    function describeArc(startAngle: number, endAngle: number, outerR: number, innerR: number) {
        const start1 = polarToCartesian(startAngle, outerR);
        const end1 = polarToCartesian(endAngle, outerR);
        const start2 = polarToCartesian(endAngle, innerR);
        const end2 = polarToCartesian(startAngle, innerR);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        if (innerR === 0) {
            return [
                `M ${center} ${center}`,
                `L ${start1.x} ${start1.y}`,
                `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}`,
                'Z',
            ].join(' ');
        }

        return [
            `M ${start1.x} ${start1.y}`,
            `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}`,
            `L ${start2.x} ${start2.y}`,
            `A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y}`,
            'Z',
        ].join(' ');
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center text-foreground-muted" style={{ width: size, height: size }}>
                Không có dữ liệu
            </div>
        );
    }

    return (
        <div className={cn('flex items-center gap-6', showLegend ? 'flex-row' : 'flex-col')}>
            {/* Pie */}
            <svg width={size} height={size} className="shrink-0">
                {slices.map((slice, i) => (
                    <path
                        key={i}
                        d={describeArc(slice.startAngle, slice.endAngle, radius, innerRadius)}
                        fill={slice.color}
                        stroke="var(--background-secondary)"
                        strokeWidth="2"
                        className="transition-all hover:opacity-80 cursor-pointer"
                    >
                        <title>{slice.label}: {slice.value.toLocaleString('vi-VN')} ({slice.percentage.toFixed(1)}%)</title>
                    </path>
                ))}

                {/* Center text for donut */}
                {donut && (
                    <g>
                        <text
                            x={center}
                            y={center - 5}
                            textAnchor="middle"
                            className="fill-foreground text-lg font-bold"
                            style={{ fontSize: '16px' }}
                        >
                            {total.toLocaleString('vi-VN')}
                        </text>
                        <text
                            x={center}
                            y={center + 12}
                            textAnchor="middle"
                            className="fill-foreground-secondary"
                            style={{ fontSize: '10px' }}
                        >
                            Tổng
                        </text>
                    </g>
                )}
            </svg>

            {/* Legend */}
            {showLegend && (
                <div className="space-y-2">
                    {slices.map((slice, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{ backgroundColor: slice.color }}
                            />
                            <span className="text-foreground-secondary">{slice.label}</span>
                            <span className="text-foreground font-medium ml-auto">
                                {slice.percentage.toFixed(1)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== BAR CHART (Enhanced) ====================

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
    horizontal?: boolean;
    showValues?: boolean;
}

export function BarChart({
    data,
    height = 200,
    horizontal = false,
    showValues = true,
}: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1;

    if (horizontal) {
        return (
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground-secondary">{item.label}</span>
                            {showValues && (
                                <span className="text-foreground font-medium">
                                    {item.value.toLocaleString('vi-VN')}
                                </span>
                            )}
                        </div>
                        <div className="h-4 bg-background-tertiary rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: item.color || 'var(--primary-500)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2 justify-between" style={{ height }}>
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full flex justify-center" style={{ height: height - 30 }}>
                        <div
                            className="w-8 rounded-t-lg transition-all duration-500"
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color || 'var(--primary-500)',
                            }}
                        />
                        {showValues && (
                            <span className="absolute -top-5 text-xs text-foreground-secondary">
                                {item.value.toLocaleString('vi-VN')}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-foreground-muted mt-2 truncate max-w-full">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
