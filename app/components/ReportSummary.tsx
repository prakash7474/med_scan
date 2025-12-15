const ReportSummary = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">AI Prescription Report</h3>

            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-gray-600">Your prescription analysis is complete. All medications appear safe with proper dosages.</p>
                </div>

                <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Medicine Details</h4>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Paracetamol 650mg: 1-0-1 for 5 days</li>
                        <li>• Amoxicillin 500mg: 1-0-1 for 7 days</li>
                    </ul>
                </div>

                <div className="border-b pb-4">
                    <h4 className="font-semibold mb-2">Instructions</h4>
                    <p className="text-gray-600">Take medications as prescribed. Complete the full course even if symptoms improve.</p>
                </div>

                <div className="pb-4">
                    <h4 className="font-semibold mb-2">Tips</h4>
                    <ul className="text-gray-600 space-y-1">
                        <li>• Stay hydrated and rest</li>
                        <li>• Avoid alcohol while taking antibiotics</li>
                        <li>• Eat light, easily digestible foods</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button className="primary-button flex-1">📄 Download PDF</button>
                <button className="bg-green-500 text-white rounded-full px-6 py-2 hover:bg-green-600 transition">📤 Share</button>
            </div>
        </div>
    );
};

export default ReportSummary;
