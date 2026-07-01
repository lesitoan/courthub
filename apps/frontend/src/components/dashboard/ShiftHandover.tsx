import { useState } from 'react';
import {
    ClipboardList,
    Plus,
    AlertTriangle,
    CheckCircle,
    Info,
    Send,
    Clock,
    User,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HandoverNote {
    id: string;
    type: 'urgent' | 'info' | 'completed';
    message: string;
    createdAt: Date;
    author: string;
    acknowledged?: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
}

interface ShiftHandoverProps {
    notes: HandoverNote[];
    currentUser: string;
    onAddNote: (note: Omit<HandoverNote, 'id' | 'createdAt'>) => void;
    onAcknowledge: (noteId: string) => void;
}

const NOTE_TYPES = [
    { id: 'urgent', label: 'Khẩn cấp', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
    { id: 'info', label: 'Thông tin', icon: Info, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'completed', label: 'Hoàn thành', icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
];

function formatTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function ShiftHandover({ notes, currentUser, onAddNote, onAcknowledge }: ShiftHandoverProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newNote, setNewNote] = useState<{ type: 'urgent' | 'info' | 'completed'; message: string }>({ type: 'info', message: '' });

    const unacknowledgedCount = notes.filter(n => !n.acknowledged && n.type === 'urgent').length;

    const handleSubmit = () => {
        if (!newNote.message.trim()) return;

        onAddNote({
            type: newNote.type,
            message: newNote.message,
            author: currentUser,
        });

        setNewNote({ type: 'info', message: '' });
        setShowAddForm(false);
    };

    return (
        <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-background-hover transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        unacknowledgedCount > 0 ? 'bg-red-500/20' : 'bg-primary-500/20'
                    )}>
                        <ClipboardList className={cn(
                            'w-5 h-5',
                            unacknowledgedCount > 0 ? 'text-red-500' : 'text-primary-500'
                        )} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            Ghi chú bàn giao ca
                            {unacknowledgedCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                    {unacknowledgedCount} cần xác nhận
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                            {notes.length} ghi chú
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-foreground-muted" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-foreground-muted" />
                )}
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="border-t border-border">
                    {/* Add Note Button */}
                    <div className="p-4 border-b border-border">
                        {!showAddForm ? (
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => setShowAddForm(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Thêm ghi chú bàn giao
                            </Button>
                        ) : (
                            <div className="space-y-3 animate-fadeIn">
                                {/* Type Selector */}
                                <div className="flex gap-2">
                                    {NOTE_TYPES.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => setNewNote(prev => ({ ...prev, type: type.id as 'urgent' | 'info' | 'completed' }))}
                                                className={cn(
                                                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all text-sm',
                                                    newNote.type === type.id
                                                        ? `${type.color} border-current`
                                                        : 'border-border hover:border-foreground-muted'
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {type.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Message Input */}
                                <textarea
                                    value={newNote.message}
                                    onChange={(e) => setNewNote(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Nhập nội dung ghi chú..."
                                    className="w-full h-24 bg-background-tertiary border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="flex-1"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className="flex-1 gap-2"
                                        onClick={handleSubmit}
                                        disabled={!newNote.message.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                        Gửi
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes List */}
                    <div className="max-h-80 overflow-auto divide-y divide-border">
                        {notes.length === 0 ? (
                            <div className="py-8 text-center text-foreground-secondary">
                                <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Chưa có ghi chú bàn giao</p>
                            </div>
                        ) : (
                            notes.map((note) => {
                                const typeConfig = NOTE_TYPES.find(t => t.id === note.type) || NOTE_TYPES[1];
                                const TypeIcon = typeConfig.icon;

                                return (
                                    <div
                                        key={note.id}
                                        className={cn(
                                            'p-4 transition-colors',
                                            !note.acknowledged && note.type === 'urgent' && 'bg-red-500/5'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                                                typeConfig.color
                                            )}>
                                                <TypeIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-foreground">{note.message}</p>

                                                <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {note.author}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(note.createdAt)} {formatTime(note.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Acknowledge */}
                                                {note.acknowledged ? (
                                                    <p className="mt-2 text-xs text-green-500 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Đã xác nhận bởi {note.acknowledgedBy}
                                                    </p>
                                                ) : note.type === 'urgent' && note.author !== currentUser && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-2 h-7 text-xs"
                                                        onClick={() => onAcknowledge(note.id)}
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Xác nhận đã đọc
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
