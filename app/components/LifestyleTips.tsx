const LifestyleTips = () => {
    const tips = [
        {
            icon: '💧',
            title: 'Stay Hydrated',
            description: 'Drink 3-4 liters of water daily to help your body fight infection and flush out toxins.'
        },
        {
            icon: '🍽',
            title: 'Eat Light Foods',
            description: 'Choose soft, easily digestible foods like soups, yogurt, and boiled vegetables.'
        },
        {
            icon: '🚫',
            title: 'Avoid Certain Foods',
            description: 'Stay away from coffee, spicy food, and alcohol while taking antibiotics.'
        },
        {
            icon: '😴',
            title: 'Get Adequate Rest',
            description: 'Aim for at least 8 hours of sleep per night to support your recovery.'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">Lifestyle & Wellness Tips</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{tip.icon}</span>
                            <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">These tips are personalized based on your prescription</p>
            </div>
        </div>
    );
};

export default LifestyleTips;
