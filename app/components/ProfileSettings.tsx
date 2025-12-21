import { useState, useEffect } from 'react';
import { usePuterStore } from '~/lib/puter';

const ProfileSettings = () => {
    const { auth, kv } = usePuterStore();
    const [settings, setSettings] = useState({
        darkMode: false,
        language: 'English',
        notifications: true,
        privacy: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const userSettings = await kv.get(`settings:${auth.user?.username || 'user'}`);
            if (userSettings) {
                setSettings(JSON.parse(userSettings));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const saveSettings = async (newSettings: any) => {
        setLoading(true);
        try {
            await kv.set(`settings:${auth.user?.username || 'user'}`, JSON.stringify(newSettings));
            setSettings(newSettings);
            // Apply dark mode
            if (newSettings.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (key: string) => {
        const newSettings = { ...settings, [key]: !settings[key as keyof typeof settings] };
        saveSettings(newSettings);
    };

    const handleLanguageChange = (language: string) => {
        const newSettings = { ...settings, language };
        saveSettings(newSettings);
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

    const settingItems = [
        {
            icon: '🌙',
            title: 'Dark Mode',
            description: 'Switch to dark theme',
            type: 'toggle',
            key: 'darkMode',
            value: settings.darkMode
        },
        {
            icon: '🌐',
            title: 'Language',
            description: settings.language,
            type: 'select',
            key: 'language',
            options: ['English', 'Spanish', 'French'],
            value: settings.language
        },
        {
            icon: '🔔',
            title: 'Notifications',
            description: 'Medicine reminders & updates',
            type: 'toggle',
            key: 'notifications',
            value: settings.notifications
        },
        {
            icon: '🔒',
            title: 'Privacy & Data',
            description: 'Manage your data & privacy settings',
            type: 'toggle',
            key: 'privacy',
            value: settings.privacy
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">Settings</h3>

            <div className="space-y-4">
                {settingItems.map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{setting.icon}</span>
                            <div>
                                <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                                <p className="text-sm text-gray-600">{setting.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            {setting.type === 'toggle' && (
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={setting.value}
                                        onChange={() => handleToggle(setting.key)}
                                        disabled={loading}
                                        title={`${setting.title} toggle`}
                                    />
                                    <div className="relative">
                                        <div className={`w-10 h-6 rounded-full shadow-inner transition ${setting.value ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute w-4 h-4 bg-white rounded-full shadow transition ${setting.value ? 'translate-x-4' : '-translate-x-1'} -top-1`}></div>
                                    </div>
                                </label>
                            )}
                            {setting.type === 'select' && (
                                <select
                                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                                    value={setting.value}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    disabled={loading}
                                >
                                    {setting.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3 font-medium hover:bg-red-100 transition"
                >
                    Sign Out
                </button>
            </div>

            {loading && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Saving settings...
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
