const HowItWorks = () => {
    const steps = [
        {
            icon: '📤',
            title: 'Upload Prescription',
            description: 'Take a photo or upload your doctor\'s prescription'
        },
        {
            icon: '🤖',
            title: 'AI Analysis',
            description: 'Our AI extracts medicine info, dosages, and instructions'
        },
        {
            icon: '💡',
            title: 'Get Insights',
            description: 'Receive clear explanations, warnings, and health tips'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold text-center mb-8">How MediScan AI Works</h3>

            <div className="space-y-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-shrink-0 text-gray-300 text-2xl">↓</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="primary-button">Get Started</button>
            </div>
        </div>
    );
};

export default HowItWorks;
