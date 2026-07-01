import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            'flex h-10 w-full rounded-md border bg-background-secondary px-3 py-2 text-sm text-foreground',
                            'placeholder:text-foreground-muted',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-all duration-200',
                            error ? 'border-error' : 'border-border',
                            icon && 'pl-10',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-error">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
