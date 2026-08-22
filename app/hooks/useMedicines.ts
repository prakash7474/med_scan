import { useState, useEffect, useCallback } from 'react';
import * as medicineService from '~/services/medicineService';
import type { Medicine } from '~/types';

/**
 * Hook for managing medicine reminders.
 */
export function useMedicines() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await medicineService.loadMedicines();
            setMedicines(data);
        } catch (err) {
            setError('Failed to load medicines.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const addMedicine = useCallback(async (medicine: Medicine) => {
        setSaving(true);
        try {
            const updated = await medicineService.addMedicine(medicine);
            setMedicines(updated);
        } catch (err) {
            setError('Failed to add medicine.');
        } finally {
            setSaving(false);
        }
    }, []);

    const removeMedicine = useCallback(async (index: number) => {
        setSaving(true);
        try {
            const updated = await medicineService.removeMedicine(index);
            setMedicines(updated);
        } catch (err) {
            setError('Failed to remove medicine.');
        } finally {
            setSaving(false);
        }
    }, []);

    const toggleMedicine = useCallback(async (index: number) => {
        setSaving(true);
        try {
            const updated = await medicineService.toggleMedicine(index);
            setMedicines(updated);
        } catch (err) {
            setError('Failed to update medicine.');
        } finally {
            setSaving(false);
        }
    }, []);

    const enableAll = useCallback(async () => {
        setSaving(true);
        try {
            const updated = await medicineService.enableAllMedicines();
            setMedicines(updated);
        } catch (err) {
            setError('Failed to enable medicines.');
        } finally {
            setSaving(false);
        }
    }, []);

    return {
        medicines,
        loading,
        saving,
        error,
        addMedicine,
        removeMedicine,
        toggleMedicine,
        enableAll,
        refresh: load,
        isEmpty: !loading && medicines.length === 0,
    };
}
