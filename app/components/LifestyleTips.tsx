interface LifestyleTipsProps {
    aiResponse?: string;
}

const LifestyleTips = ({ aiResponse }: LifestyleTipsProps) => {
    const generalTips = [
        {
            icon: '💧',
            title: 'Stay Hydrated',
            description: 'Drink 3-4 liters of water daily to help your body fight infection and flush out toxins.'
        },
        {
            icon: '🍽',
            title: 'Eat Light Foods',
            description: 'Choose soft, easily digestible foods like dal, khichdi, curd, and boiled vegetables.'
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
        },
        {
            icon: '🏃',
            title: 'Gentle Exercise',
            description: 'Light walking can help circulation, but avoid strenuous activity while on medication.'
        },
        {
            icon: '💊',
            title: 'Medication Organization',
            description: 'Use a pill organizer or set reminders to take medications on schedule.'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">Lifestyle & Wellness Tips</h3>

            {aiResponse && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-2">📋 AI-Generated Tips</h4>
                    <p className="text-sm text-blue-700 whitespace-pre-wrap">{aiResponse}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generalTips.map((tip, index) => (
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
                <p className="text-sm text-gray-500">These tips are general wellness suggestions. Always consult your healthcare professional for personalized advice.</p>
            </div>
        </div>
    );
};

export default LifestyleTips;
