import { cn } from '@/lib/utils';
import { CalendarDays, CalendarRange, List } from 'lucide-react';

export type CalendarViewMode = 'day' | 'week' | 'list';

interface ViewToggleProps {
    activeView: CalendarViewMode;
    onViewChange: (view: CalendarViewMode) => void;
}

const views: { id: CalendarViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'day', label: 'Ngày', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'week', label: 'Tuần', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'list', label: 'Danh sách', icon: <List className="w-4 h-4" /> },
];

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex bg-background-tertiary rounded-lg p-1">
            {views.map(view => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={cn(
                        'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                        activeView === view.id
                            ? 'bg-primary-500 text-white'
                            : 'text-foreground-secondary hover:text-foreground'
                    )}
                >
                    {view.icon}
                    <span className="hidden sm:inline">{view.label}</span>
                </button>
            ))}
        </div>
    );
}
