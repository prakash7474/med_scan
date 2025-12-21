import { useState, useEffect } from 'react';
import { usePuterStore } from '~/lib/puter';

const MedicineReminder = () => {
    const { auth, kv } = usePuterStore();
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newMedicine, setNewMedicine] = useState('');
    const [newDosage, setNewDosage] = useState('1-0-1');

    useEffect(() => {
        loadMedicines();
        loadPrescriptionMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            const userMedicines = await kv.get(`medicines:${auth.user?.username || 'user'}`);
            if (userMedicines) {
                setMedicines(JSON.parse(userMedicines));
            }
        } catch (error) {
            console.error('Failed to load medicines:', error);
        }
    };

    const loadPrescriptionMedicines = async () => {
        try {
            // Get all prescription keys
            const keys = await kv.list('prescription:*');
            if (!keys) return;

            const prescriptionKeys = keys.filter((key): key is string => typeof key === 'string' && key.startsWith('prescription:'));

            for (const key of prescriptionKeys) {
                const prescription = await kv.get(key);
                if (prescription) {
                    const data = JSON.parse(prescription);
                    const aiResponse = data.aiResponse || '';

                    // Extract medicine names from AI response
                    const medicineMatches = aiResponse.match(/([A-Z][a-z]+(?:\s+[0-9]+(?:mg|g|ml))?)/g);
                    if (medicineMatches) {
                        const newMedicines = medicineMatches.map((name: string) => ({
                            name: name.trim(),
                            dosage: '1-0-1',
                            morning: true,
                            afternoon: false,
                            night: true,
                            enabled: true
                        }));

                        // Add new medicines if not already in list
                        setMedicines(prev => {
                            const existingNames = prev.map((m: any) => m.name);
                            const filteredNew = newMedicines.filter((m: any) => !existingNames.includes(m.name));
                            return [...prev, ...filteredNew];
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load prescription medicines:', error);
        }
    };

    const saveMedicines = async (newMedicines: any[]) => {
        setLoading(true);
        try {
            await kv.set(`medicines:${auth.user?.id}`, JSON.stringify(newMedicines));
            setMedicines(newMedicines);
        } catch (error) {
            console.error('Failed to save medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMedicine = (index: number) => {
        const newMedicines = [...medicines];
        newMedicines[index].enabled = !newMedicines[index].enabled;
        saveMedicines(newMedicines);
    };

    const enableAllReminders = () => {
        const newMedicines = medicines.map(medicine => ({ ...medicine, enabled: true }));
        saveMedicines(newMedicines);
    };

    const addMedicine = () => {
        if (newMedicine.trim()) {
            const medicine = {
                name: newMedicine.trim(),
                dosage: newDosage,
                morning: newDosage.includes('1') && newDosage.split('-')[0] === '1',
                afternoon: newDosage.split('-')[1] === '1',
                night: newDosage.split('-')[2] === '1',
                enabled: true
            };
            const newMedicines = [...medicines, medicine];
            saveMedicines(newMedicines);
            setNewMedicine('');
            setNewDosage('1-0-1');
        }
    };

    const removeMedicine = (index: number) => {
        const newMedicines = medicines.filter((_, i) => i !== index);
        saveMedicines(newMedicines);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-4">Medicine Reminders</h3>

            {/* Add new medicine */}
            <div className="mb-6 p-4 border border-gray-200 rounded-xl">
                <h4 className="font-semibold mb-3">Add New Medicine</h4>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Medicine name"
                        value={newMedicine}
                        onChange={(e) => setNewMedicine(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        title="Select dosage pattern"
                    >
                        <option value="1-0-1">1-0-1</option>
                        <option value="1-1-1">1-1-1</option>
                        <option value="0-1-0">0-1-0</option>
                        <option value="1-0-0">1-0-0</option>
                        <option value="0-0-1">0-0-1</option>
                    </select>
                    <button
                        onClick={addMedicine}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {medicines.map((medicine, index) => (
                    <div key={index} className="border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{medicine.name}</h4>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={medicine.enabled}
                                        onChange={() => toggleMedicine(index)}
                                        disabled={loading}
                                    />
                                    <div className="relative">
                                        <div className={`w-10 h-6 rounded-full shadow-inner transition ${medicine.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute w-4 h-4 bg-white rounded-full shadow transition ${medicine.enabled ? 'translate-x-4' : '-translate-x-1'} -top-1`}></div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium">{medicine.enabled ? 'ON' : 'OFF'}</span>
                                </label>
                                <button
                                    onClick={() => removeMedicine(index)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>🌅 Morning: {medicine.morning ? 'Yes' : 'No'}</span>
                            <span>🌤 Afternoon: {medicine.afternoon ? 'Yes' : 'No'}</span>
                            <span>🌙 Night: {medicine.night ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                ))}
            </div>

            {medicines.length > 0 && (
                <button
                    onClick={enableAllReminders}
                    className="primary-button w-full mt-4"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Enable All Reminders'}
                </button>
            )}

            {medicines.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No medicines added yet. Add medicines from your prescriptions or manually.</p>
                </div>
            )}
        </div>
    );
};

export default MedicineReminder;
