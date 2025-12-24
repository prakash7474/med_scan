import { useState, useEffect } from 'react';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';

interface SettingItem {
    icon: string;
    title: string;
    description: string;
    type: 'toggle' | 'select';
    key: keyof Settings;
    value: boolean | string;
    options?: string[];
}

interface NotificationItem {
    title: string;
    description: string;
    key: keyof Settings;
    value: boolean;
}

interface Settings {
    darkMode: boolean;
    language: string;
    notifications: boolean;
    medicineReminders: boolean;
    reportUpdates: boolean;
    emergencyAlerts: boolean;
    privacy: boolean;
    autoBackup: boolean;
    dataRetention: string;
    emailAlerts: boolean;
    soundEnabled: boolean;
}

interface ProfileSettingsProps {
    isModal?: boolean;
}

const ProfileSettings = ({ isModal = false }: ProfileSettingsProps) => {
    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();

    const [settings, setSettings] = useState<Settings>({
        darkMode: false,
        language: 'English',
        notifications: true,
        medicineReminders: true,
        reportUpdates: true,
        emergencyAlerts: false,
        privacy: true,
        autoBackup: false,
        dataRetention: '1year',
        emailAlerts: false,
        soundEnabled: true
    });

    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const userSettings = await kv.get(`settings:${auth.user?.username || 'user'}`);
            if (userSettings) {
                const parsedSettings = JSON.parse(typeof userSettings === 'string' ? userSettings : (userSettings as any).value);
                setSettings(prev => ({ ...prev, ...parsedSettings }));

                // Ensure we start in light theme regardless of saved settings
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const saveSettings = async (newSettings: Settings) => {
        setLoading(true);
        try {
            await kv.set(`settings:${auth.user?.username || 'user'}`, JSON.stringify(newSettings));
            setSettings(newSettings);

            // Apply dark mode
            if (newSettings.darkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: keyof Settings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        saveSettings(newSettings);
    };

    const handleSelectChange = (key: keyof Settings, value: string) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const handleExportData = async () => {
        setExportLoading(true);
        try {
            // Get all prescriptions
            const prescriptions = await kv.list('prescription:*', true);
            const prescriptionData = prescriptions?.map((p: any) =>
                JSON.parse(typeof p === 'string' ? p : p.value)
            ) || [];

            // Get settings
            const userSettings = await kv.get(`settings:${auth.user?.username || 'user'}`);

            const exportData = {
                user: auth.user?.username,
                exportDate: new Date().toISOString(),
                prescriptions: prescriptionData,
                settings: userSettings ? JSON.parse(typeof userSettings === 'string' ? userSettings : (userSettings as any).value) : null
            };

            // Create and download file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mediscan-data-${auth.user?.username}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Data exported successfully!');
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (confirm('Are you sure you want to sign out?')) {
            try {
                await auth.signOut();
                window.location.href = '/auth';
            } catch (error) {
                console.error('Failed to sign out:', error);
            }
        }
    };

    const handleWipeData = () => {
        navigate('/wipe');
    };

    const notificationItems: NotificationItem[] = [
        {
            title: 'Medicine Reminders',
            description: 'Daily medication notifications',
            key: 'medicineReminders',
            value: settings.medicineReminders
        },
        {
            title: 'Report Updates',
            description: 'New prescription analysis available',
            key: 'reportUpdates',
            value: settings.reportUpdates
        },
        {
            title: 'Emergency Alerts',
            description: 'Critical health notifications',
            key: 'emergencyAlerts',
            value: settings.emergencyAlerts
        }
    ];

    return (
        <div className={`${isModal ? 'w-full max-h-[80vh] overflow-y-auto' : 'bg-white rounded-2xl shadow-md p-6 w-full max-h-[80vh] overflow-y-auto'}`}>
            <h3 className="text-2xl font-bold mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">Settings</h3>

            {/* Appearance Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">⚙️</span>
                    <h4 className="text-lg font-semibold text-gray-800">Appearance</h4>
                </div>
                <div className="space-y-3">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{settings.darkMode ? '🌙' : '☀️'}</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Dark Mode</h5>
                                <p className="text-sm text-gray-600">Switch to dark theme</p>
                            </div>
                        </div>
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={settings.darkMode}
                                    onChange={() => handleToggle('darkMode')}
                                    disabled={loading}
                                    className='sr-only'
                                    title="Dark Mode toggle"
                                />
                                <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.darkMode ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {/* Language Selector */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🌐</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Language</h5>
                                <p className="text-sm text-gray-600">Choose your preferred language</p>
                            </div>
                        </div>
                        <select
                            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition-colors"
                            value={settings.language}
                            onChange={(e) => handleSelectChange('language', e.target.value)}
                            disabled={loading}
                            title="Language selection"
                        >
                            <option value="English">🇬🇧 English</option>
                            <option value="Spanish">🇪🇸 Spanish</option>
                            <option value="French">🇫🇷 French</option>
                            <option value="German">🇩🇪 German</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🔔</span>
                    <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
                </div>

                {/* Main Notifications Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm mb-3">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">🔔</span>
                        <div>
                            <h5 className="font-semibold text-gray-800">Notifications</h5>
                            <p className="text-sm text-gray-600">Enable all notifications</p>
                        </div>
                    </div>
                    <label className='flex cursor-pointer select-none items-center'>
                        <div className='relative'>
                            <input
                                type='checkbox'
                                checked={settings.notifications}
                                onChange={() => handleToggle('notifications')}
                                disabled={loading}
                                className='sr-only'
                                title="Notifications toggle"
                            />
                            <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.notifications ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                </div>

                {/* Sub-notifications - only show when main notifications are enabled */}
                {settings.notifications && (
                    <div className="ml-8 space-y-2 animate-fade-in">
                        {notificationItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                                <div>
                                    <h6 className="font-medium text-gray-800 text-sm">{item.title}</h6>
                                    <p className="text-xs text-gray-600">{item.description}</p>
                                </div>
                                <label className='flex cursor-pointer select-none items-center'>
                                    <div className='relative'>
                                        <input
                                            type='checkbox'
                                            checked={item.value}
                                            onChange={() => handleToggle(item.key)}
                                            disabled={loading}
                                            className='sr-only'
                                            title={`${item.title} toggle`}
                                        />
                                        <div className={`block h-6 w-12 rounded-full transition-all duration-300 ${item.value ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 shadow-sm ${item.value ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Data & Privacy Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🔐</span>
                    <h4 className="text-lg font-semibold text-gray-800">Data & Privacy</h4>
                </div>
                <div className="space-y-3">
                    {/* Auto Backup */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">💾</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Auto Backup</h5>
                                <p className="text-sm text-gray-600">Automatically backup your data</p>
                            </div>
                        </div>
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={settings.autoBackup}
                                    onChange={() => handleToggle('autoBackup')}
                                    disabled={loading}
                                    className='sr-only'
                                    title="Auto Backup toggle"
                                />
                                <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.autoBackup ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.autoBackup ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {/* Data Retention */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">⏰</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Data Retention</h5>
                                <p className="text-sm text-gray-600">How long to keep your data</p>
                            </div>
                        </div>
                        <select
                            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition-colors"
                            value={settings.dataRetention}
                            onChange={(e) => handleSelectChange('dataRetention', e.target.value)}
                            disabled={loading}
                            title="Data Retention selection"
                        >
                            <option value="6months">6 Months</option>
                            <option value="1year">1 Year</option>
                            <option value="2years">2 Years</option>
                            <option value="forever">Forever</option>
                        </select>
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">🔊</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Sound Effects</h5>
                                <p className="text-sm text-gray-600">Enable notification sounds</p>
                            </div>
                        </div>
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={settings.soundEnabled}
                                    onChange={() => handleToggle('soundEnabled')}
                                    disabled={loading}
                                    className='sr-only'
                                    title="Sound Effects toggle"
                                />
                                <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.soundEnabled ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>

                    {/* Email Alerts */}
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">📧</span>
                            <div>
                                <h5 className="font-semibold text-gray-800">Email Alerts</h5>
                                <p className="text-sm text-gray-600">Receive email notifications</p>
                            </div>
                        </div>
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked={settings.emailAlerts}
                                    onChange={() => handleToggle('emailAlerts')}
                                    disabled={loading}
                                    className='sr-only'
                                    title="Email Alerts toggle"
                                />
                                <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.emailAlerts ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleExportData}
                        disabled={exportLoading}
                        className="bg-blue-50 text-blue-600 border border-blue-200 rounded-xl py-3 font-medium hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                    >
                        {exportLoading ? '📤 Exporting...' : '📤 Export Data'}
                    </button>
                    <button
                        onClick={handleWipeData}
                        className="bg-orange-50 text-orange-600 border border-orange-200 rounded-xl py-3 font-medium hover:bg-orange-100 transition-all duration-200 hover:shadow-sm"
                    >
                        🗑️ Wipe Data
                    </button>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3 font-medium hover:bg-red-100 transition-all duration-200 hover:shadow-sm"
                >
                    🚪 Sign Out
                </button>
            </div>

            {loading && (
                <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
                    💾 Saving settings...
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;

