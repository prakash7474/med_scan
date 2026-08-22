import { useState } from 'react';
import { useMedicines } from '~/hooks/useMedicines';
import LoadingSpinner from '~/components/ui/LoadingSpinner';
import ErrorMessage from '~/components/ui/ErrorMessage';
import EmptyState from '~/components/ui/EmptyState';
import type { Medicine } from '~/types';

interface MedicineReminderProps {
    isModal?: boolean;
}

const MedicineReminder = ({ isModal = false }: MedicineReminderProps) => {
    const {
        medicines,
        loading,
        saving,
        error,
        addMedicine,
        removeMedicine,
        toggleMedicine,
        enableAll,
    } = useMedicines();
    const [newMedicine, setNewMedicine] = useState('');
    const [newDosage, setNewDosage] = useState('1-0-1');

    const handleAdd = () => {
        if (!newMedicine.trim()) return;
        const medicine: Medicine = {
            name: newMedicine.trim(),
            dosage: newDosage,
            morning: newDosage.split('-')[0] === '1',
            afternoon: newDosage.split('-')[1] === '1',
            night: newDosage.split('-')[2] === '1',
            enabled: true,
        };
        addMedicine(medicine);
        setNewMedicine('');
        setNewDosage('1-0-1');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className={`${isModal ? 'w-full' : 'bg-white rounded-2xl shadow-md p-6 w-full'}`}>
            <h3 className="text-2xl font-bold mb-4">Medicine Reminders</h3>

            {loading && <LoadingSpinner message="Loading medicines..." size="sm" />}

            {error && <ErrorMessage message={error} />}

            {!loading && !error && (
                <>
                    {/* Add new medicine */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-xl">
                        <h4 className="font-semibold mb-3">Add New Medicine</h4>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Medicine name"
                                value={newMedicine}
                                onChange={(e) => setNewMedicine(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                aria-label="Medicine name"
                            />
                            <select
                                value={newDosage}
                                onChange={(e) => setNewDosage(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                title="Select dosage pattern"
                                aria-label="Dosage pattern"
                            >
                                <option value="1-0-1">1-0-1</option>
                                <option value="1-1-1">1-1-1</option>
                                <option value="0-1-0">0-1-0</option>
                                <option value="1-0-0">1-0-0</option>
                                <option value="0-0-1">0-0-1</option>
                            </select>
                            <button
                                onClick={handleAdd}
                                disabled={saving || !newMedicine.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>

                    {medicines.length === 0 ? (
                        <EmptyState
                            icon="💊"
                            title="No medicines added"
                            description="Add your first medicine reminder to get started."
                        />
                    ) : (
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
                                                    disabled={saving}
                                                    aria-label={`Toggle ${medicine.name} reminder`}
                                                />
                                                <div className="relative">
                                                    <div className={`w-10 h-6 rounded-full shadow-inner transition ${medicine.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition shadow-md ${medicine.enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => removeMedicine(index)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                                                aria-label={`Remove ${medicine.name}`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                        <span className={medicine.morning ? 'text-green-600 font-medium' : ''}>🌅 Morning</span>
                                        <span className={medicine.afternoon ? 'text-green-600 font-medium' : ''}>☀️ Afternoon</span>
                                        <span className={medicine.night ? 'text-green-600 font-medium' : ''}>🌙 Night</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {medicines.length > 0 && (
                        <button
                            onClick={enableAll}
                            disabled={saving}
                            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            Enable All Reminders
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default MedicineReminder;
