const ProfileSettings = () => {
    const settings = [
        {
            icon: '🌙',
            title: 'Dark Mode',
            description: 'Switch to dark theme',
            type: 'toggle',
            value: false
        },
        {
            icon: '🌐',
            title: 'Language',
            description: 'English',
            type: 'select',
            options: ['English', 'Spanish', 'French']
        },
        {
            icon: '🔔',
            title: 'Notifications',
            description: 'Medicine reminders & updates',
            type: 'toggle',
            value: true
        },
        {
            icon: '🔒',
            title: 'Privacy & Data',
            description: 'Manage your data & privacy settings',
            type: 'link'
        },
        {
            icon: '📋',
            title: 'Medical History',
            description: 'View your prescription history',
            type: 'link'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">Settings</h3>

            <div className="space-y-4">
                {settings.map((setting, index) => (
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
                                    <input type="checkbox" className="sr-only" defaultChecked={setting.value} />
                                    <div className="relative">
                                        <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                                        <div className="dot absolute w-4 h-4 bg-blue-500 rounded-full shadow -left-1 -top-1 transition"></div>
                                    </div>
                                </label>
                            )}
                            {setting.type === 'select' && (
                                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm">
                                    {setting.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )}
                            {setting.type === 'link' && (
                                <span className="text-blue-500 text-sm font-medium">→</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl py-3 font-medium hover:bg-red-100 transition">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
