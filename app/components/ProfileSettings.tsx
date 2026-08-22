import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettings } from '~/hooks/useSettings';
import * as settingsService from '~/services/settingsService';
import type { AppSettings } from '~/types';

interface ProfileSettingsProps {
    isModal?: boolean;
}

const ProfileSettings = ({ isModal = false }: ProfileSettingsProps) => {
    const { settings, loading, saving, updateSettings, toggleSetting } = useSettings();
    const [exportLoading, setExportLoading] = useState(false);
    const navigate = useNavigate();

    const handleSelectChange = (key: keyof AppSettings, value: string) => {
        updateSettings({ [key]: value });
    };

    const handleExportData = async () => {
        setExportLoading(true);
        try {
            const dataStr = await settingsService.exportUserData();
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mediscan-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Data exported successfully!');
        } catch (error) {
            alert('Failed to export data. Please try again.');
        } finally {
            setExportLoading(false);
        }
    };

    const handleWipeData = () => {
        navigate('/wipe');
    };

    const notificationItems = [
        { title: 'Medicine Reminders', description: 'Daily medication notifications', key: 'medicineReminders' as const, value: settings.medicineReminders },
        { title: 'Report Updates', description: 'New prescription analysis available', key: 'reportUpdates' as const, value: settings.reportUpdates },
        { title: 'Emergency Alerts', description: 'Critical health notifications', key: 'emergencyAlerts' as const, value: settings.emergencyAlerts },
    ];

    return (
        <div className={`${isModal ? 'w-full max-h-[80vh] overflow-y-auto' : 'bg-white rounded-2xl shadow-md p-6 w-full max-h-[80vh] overflow-y-auto'}`}>
            <h3 className="text-2xl font-bold mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">Settings</h3>

            {loading ? (
                <p className="text-gray-500 text-center py-8">Loading settings...</p>
            ) : (
                <>
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
                                        <input type='checkbox' checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} disabled={saving} className='sr-only' title="Dark Mode toggle" />
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
                                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition-colors" value={settings.language} onChange={(e) => handleSelectChange('language', e.target.value)} disabled={saving} title="Language selection">
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
                                    <input type='checkbox' checked={settings.notifications} onChange={() => toggleSetting('notifications')} disabled={saving} className='sr-only' title="Notifications toggle" />
                                    <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings.notifications ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        </div>

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
                                                <input type='checkbox' checked={item.value} onChange={() => toggleSetting(item.key)} disabled={saving} className='sr-only' title={`${item.title} toggle`} />
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
                            {[
                                { key: 'autoBackup' as const, icon: '💾', title: 'Auto Backup', desc: 'Automatically backup your data' },
                                { key: 'soundEnabled' as const, icon: '🔊', title: 'Sound Effects', desc: 'Enable notification sounds' },
                                { key: 'emailAlerts' as const, icon: '📧', title: 'Email Alerts', desc: 'Receive email notifications' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <h5 className="font-semibold text-gray-800">{item.title}</h5>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                    <label className='flex cursor-pointer select-none items-center'>
                                        <div className='relative'>
                                            <input type='checkbox' checked={settings[item.key]} onChange={() => toggleSetting(item.key)} disabled={saving} className='sr-only' title={`${item.title} toggle`} />
                                            <div className={`block h-8 w-14 rounded-full transition-all duration-300 ${settings[item.key] ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 shadow-md ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                    </label>
                                </div>
                            ))}

                            {/* Data Retention */}
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">⏰</span>
                                    <div>
                                        <h5 className="font-semibold text-gray-800">Data Retention</h5>
                                        <p className="text-sm text-gray-600">How long to keep your data</p>
                                    </div>
                                </div>
                                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition-colors" value={settings.dataRetention} onChange={(e) => handleSelectChange('dataRetention', e.target.value)} disabled={saving} title="Data Retention selection">
                                    <option value="6months">6 Months</option>
                                    <option value="1year">1 Year</option>
                                    <option value="2years">2 Years</option>
                                    <option value="forever">Forever</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="pt-6 border-t border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={handleExportData} disabled={exportLoading} className="bg-blue-50 text-blue-600 border border-blue-200 rounded-xl py-3 font-medium hover:bg-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm">
                                {exportLoading ? '📤 Exporting...' : '📤 Export Data'}
                            </button>
                            <button onClick={handleWipeData} className="bg-orange-50 text-orange-600 border border-orange-200 rounded-xl py-3 font-medium hover:bg-orange-100 transition-all duration-200 hover:shadow-sm">
                                🗑️ Wipe Data
                            </button>
                        </div>
                    </div>

                    {saving && (
                        <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
                            💾 Saving settings...
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileSettings;
