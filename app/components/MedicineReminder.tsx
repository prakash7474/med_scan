const MedicineReminder = () => {
    const medicines = [
        { name: "Paracetamol 650mg", dosage: "1-0-1", morning: true, afternoon: false, night: true },
        { name: "Amoxicillin 500mg", dosage: "1-0-1", morning: true, afternoon: false, night: true },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-4">Medicine Reminders</h3>
            <div className="space-y-4">
                {medicines.map((medicine, index) => (
                    <div key={index} className="border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{medicine.name}</h4>
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only" defaultChecked />
                                <div className="relative">
                                    <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                                    <div className="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                                </div>
                                <span className="ml-3 text-sm font-medium">ON</span>
                            </label>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>🌅 Morning: {medicine.morning ? 'Yes' : 'No'}</span>
                            <span>🌤 Afternoon: {medicine.afternoon ? 'Yes' : 'No'}</span>
                            <span>🌙 Night: {medicine.night ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="primary-button w-full mt-4">Enable All Reminders</button>
        </div>
    );
};

export default MedicineReminder;
