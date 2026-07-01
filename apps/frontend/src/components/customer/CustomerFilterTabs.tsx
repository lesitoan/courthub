import { cn } from '@/lib/utils';
import { Users, Crown, Star, Clock } from 'lucide-react';

export type CustomerFilter = 'all' | 'members' | 'frequent' | 'new';

interface FilterTab {
    id: CustomerFilter;
    label: string;
    icon: typeof Users;
    count?: number;
    color: string;
}

interface CustomerFilterTabsProps {
    activeFilter: CustomerFilter;
    onFilterChange: (filter: CustomerFilter) => void;
    counts?: {
        all: number;
        members: number;
        frequent: number;
        new: number;
    };
}

const FILTER_TABS: Omit<FilterTab, 'count'>[] = [
    { id: 'all', label: 'Tất cả', icon: Users, color: 'text-foreground' },
    { id: 'members', label: 'Thành viên', icon: Crown, color: 'text-yellow-500' },
    { id: 'frequent', label: 'Khách quen', icon: Star, color: 'text-blue-500' },
    { id: 'new', label: 'Khách mới', icon: Clock, color: 'text-green-500' },
];

export function CustomerFilterTabs({ activeFilter, onFilterChange, counts }: CustomerFilterTabsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => {
                const Icon = tab.icon;
                const count = counts?.[tab.id];
                const isActive = activeFilter === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onFilterChange(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                            isActive
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-background-secondary border-border hover:border-primary-500/50 hover:bg-background-hover'
                        )}
                    >
                        <Icon className={cn('w-4 h-4', isActive ? 'text-white' : tab.color)} />
                        <span className="font-medium">{tab.label}</span>
                        {count !== undefined && (
                            <span className={cn(
                                'px-2 py-0.5 text-xs rounded-full',
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-background-tertiary text-foreground-secondary'
                            )}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// Compact version for mobile
export function CustomerFilterDropdown({
    activeFilter,
    onFilterChange,
    counts
}: CustomerFilterTabsProps) {
    const activeTab = FILTER_TABS.find(t => t.id === activeFilter) || FILTER_TABS[0];
    const ActiveIcon = activeTab.icon;

    return (
        <div className="relative">
            <select
                value={activeFilter}
                onChange={(e) => onFilterChange(e.target.value as CustomerFilter)}
                className="appearance-none w-full bg-background-secondary border border-border rounded-lg px-4 py-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                {FILTER_TABS.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                        {tab.label} {counts?.[tab.id] !== undefined && `(${counts[tab.id]})`}
                    </option>
                ))}
            </select>
            <ActiveIcon className={cn('absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none', activeTab.color)} />
        </div>
    );
}
