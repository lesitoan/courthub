import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
            {/* Illustration container */}
            <div className="relative mb-6">
                {/* Decorative circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary-500/5 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary-500/10" />
                </div>

                {/* Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-500" />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-foreground-secondary text-center max-w-sm mb-6">
                    {description}
                </p>
            )}

            {/* Action */}
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}
