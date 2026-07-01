import { useState } from 'react';
import {
    Building2,
    Clock,
    DollarSign,
    Bell,
    Save,
    Loader2,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface VenueSettings {
    name: string;
    address: string;
    phone: string;
    email: string;
    openTime: string;
    closeTime: string;
    slotDuration: number;
    defaultHourlyRate: number;
    peakHourRate: number;
    peakHours: string[];
    currency: string;
    timezone: string;
}

interface SettingsSectionProps {
    title: string;
    description?: string;
    icon: typeof Building2;
    children: React.ReactNode;
    isExpanded?: boolean;
    onToggle?: () => void;
}

function SettingsSection({ title, description, icon: Icon, children, isExpanded = true, onToggle }: SettingsSectionProps) {
    return (
        <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-background-hover transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-foreground">{title}</h3>
                        {description && (
                            <p className="text-sm text-foreground-secondary">{description}</p>
                        )}
                    </div>
                </div>
                <ChevronRight className={cn(
                    'w-5 h-5 text-foreground-muted transition-transform',
                    isExpanded && 'rotate-90'
                )} />
            </button>
            {isExpanded && (
                <div className="p-4 pt-0 border-t border-border">
                    {children}
                </div>
            )}
        </div>
    );
}

interface VenueSettingsFormProps {
    initialSettings: VenueSettings;
    onSave: (settings: VenueSettings) => Promise<void>;
}

export function VenueSettingsForm({ initialSettings, onSave }: VenueSettingsFormProps) {
    const [settings, setSettings] = useState<VenueSettings>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string>('basic');

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(settings);
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = <K extends keyof VenueSettings>(key: K, value: VenueSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            {/* Basic Info */}
            <SettingsSection
                title="Thông tin cơ sở"
                description="Tên, địa chỉ và liên hệ"
                icon={Building2}
                isExpanded={expandedSection === 'basic'}
                onToggle={() => setExpandedSection(expandedSection === 'basic' ? '' : 'basic')}
            >
                <div className="space-y-4 pt-4">
                    <Input
                        label="Tên cơ sở"
                        value={settings.name}
                        onChange={(e) => updateSetting('name', e.target.value)}
                        placeholder="VD: Sân cầu lông ABC"
                    />
                    <Input
                        label="Địa chỉ"
                        value={settings.address}
                        onChange={(e) => updateSetting('address', e.target.value)}
                        placeholder="VD: 123 Nguyễn Văn A, Quận 1, TP.HCM"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Số điện thoại"
                            value={settings.phone}
                            onChange={(e) => updateSetting('phone', e.target.value)}
                            placeholder="0123 456 789"
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => updateSetting('email', e.target.value)}
                            placeholder="contact@example.com"
                        />
                    </div>
                </div>
            </SettingsSection>

            {/* Operating Hours */}
            <SettingsSection
                title="Giờ hoạt động"
                description="Thời gian mở cửa và slot"
                icon={Clock}
                isExpanded={expandedSection === 'hours'}
                onToggle={() => setExpandedSection(expandedSection === 'hours' ? '' : 'hours')}
            >
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Giờ mở cửa</label>
                            <input
                                type="time"
                                value={settings.openTime}
                                onChange={(e) => updateSetting('openTime', e.target.value)}
                                className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Giờ đóng cửa</label>
                            <input
                                type="time"
                                value={settings.closeTime}
                                onChange={(e) => updateSetting('closeTime', e.target.value)}
                                className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Thời lượng mỗi slot (phút)
                        </label>
                        <select
                            value={settings.slotDuration}
                            onChange={(e) => updateSetting('slotDuration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-background-tertiary border border-border rounded-lg"
                        >
                            <option value={30}>30 phút</option>
                            <option value={60}>60 phút</option>
                            <option value={90}>90 phút</option>
                            <option value={120}>120 phút</option>
                        </select>
                    </div>
                </div>
            </SettingsSection>

            {/* Pricing */}
            <SettingsSection
                title="Bảng giá"
                description="Giá thuê sân theo giờ"
                icon={DollarSign}
                isExpanded={expandedSection === 'pricing'}
                onToggle={() => setExpandedSection(expandedSection === 'pricing' ? '' : 'pricing')}
            >
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Giá giờ thường (VNĐ)"
                            type="number"
                            value={settings.defaultHourlyRate.toString()}
                            onChange={(e) => updateSetting('defaultHourlyRate', parseInt(e.target.value) || 0)}
                            placeholder="80000"
                        />
                        <Input
                            label="Giá giờ cao điểm (VNĐ)"
                            type="number"
                            value={settings.peakHourRate.toString()}
                            onChange={(e) => updateSetting('peakHourRate', parseInt(e.target.value) || 0)}
                            placeholder="120000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Khung giờ cao điểm
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['17:00-19:00', '19:00-21:00', '07:00-09:00'].map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => {
                                        const isSelected = settings.peakHours.includes(slot);
                                        updateSetting('peakHours',
                                            isSelected
                                                ? settings.peakHours.filter(h => h !== slot)
                                                : [...settings.peakHours, slot]
                                        );
                                    }}
                                    className={cn(
                                        'px-3 py-1.5 rounded-lg border text-sm transition-all',
                                        settings.peakHours.includes(slot)
                                            ? 'bg-primary-500 text-white border-primary-500'
                                            : 'bg-background-tertiary border-border hover:border-primary-500'
                                    )}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </Button>
            </div>
        </div>
    );
}

// Notification Settings
interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingReminder: boolean;
    reminderHours: number;
    dailyReport: boolean;
    lowStockAlert: boolean;
}

interface NotificationSettingsFormProps {
    initialSettings: NotificationSettings;
    onSave: (settings: NotificationSettings) => Promise<void>;
}

export function NotificationSettingsForm({ initialSettings, onSave }: NotificationSettingsFormProps) {
    const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(settings);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleSetting = (key: keyof NotificationSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-background-secondary rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Thông báo</h3>
                    <p className="text-sm text-foreground-secondary">Cài đặt email và SMS</p>
                </div>
            </div>

            <div className="space-y-4">
                {[
                    { key: 'emailNotifications', label: 'Thông báo qua Email', description: 'Nhận thông báo qua email' },
                    { key: 'smsNotifications', label: 'Thông báo qua SMS', description: 'Nhận thông báo qua tin nhắn' },
                    { key: 'bookingReminder', label: 'Nhắc lịch đặt sân', description: 'Tự động gửi nhắc nhở trước buổi chơi' },
                    { key: 'dailyReport', label: 'Báo cáo hàng ngày', description: 'Nhận tổng kết cuối ngày' },
                    { key: 'lowStockAlert', label: 'Cảnh báo tồn kho', description: 'Thông báo khi sản phẩm sắp hết' },
                ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg cursor-pointer hover:bg-background-hover transition-colors">
                        <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-foreground-secondary">{item.description}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => toggleSetting(item.key as keyof NotificationSettings)}
                            className="w-5 h-5 rounded border-border bg-background-secondary text-primary-500 focus:ring-primary-500"
                        />
                    </label>
                ))}
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </Button>
            </div>
        </div>
    );
}
