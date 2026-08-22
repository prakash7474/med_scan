import { useState, useEffect, useCallback } from 'react';
import { usePuterStore } from '~/lib/puter';
import * as prescriptionService from '~/services/prescriptionService';
import type { Prescription } from '~/types';

/**
 * Hook for managing prescription data.
 * Handles loading, error states, and provides CRUD operations.
 */
export function usePrescriptions() {
    const { puterReady } = usePuterStore();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPrescriptions = useCallback(async () => {
        if (!puterReady) return;
        setLoading(true);
        setError(null);
        try {
            const data = await prescriptionService.listPrescriptions();
            setPrescriptions(data);
        } catch (err) {
            setError('Failed to load prescriptions. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [puterReady]);

    useEffect(() => {
        loadPrescriptions();
    }, [loadPrescriptions]);

    const refresh = useCallback(() => {
        loadPrescriptions();
    }, [loadPrescriptions]);

    return {
        prescriptions,
        loading,
        error,
        refresh,
        isEmpty: !loading && prescriptions.length === 0,
    };
}

/**
 * Hook for loading a single prescription by ID.
 */
export function usePrescription(id: string | undefined) {
    const { puterReady, fs } = usePuterStore();
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [prescriptionUrl, setPrescriptionUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!puterReady || !id) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await prescriptionService.getPrescription(id);
                if (cancelled) return;

                if (!data) {
                    setError('Prescription not found.');
                    setLoading(false);
                    return;
                }

                // Load image
                const imageBlob = await fs.read(data.imagePath);
                if (cancelled) return;
                if (imageBlob) {
                    setImageUrl(URL.createObjectURL(imageBlob));
                }

                // Load PDF
                const pdfBlob = await fs.read(data.prescriptionPath);
                if (cancelled) return;
                if (pdfBlob) {
                    setPrescriptionUrl(URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' })));
                }

                setPrescription(data);
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to load prescription. Please try again.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [id, puterReady, fs]);

    return {
        prescription,
        imageUrl,
        prescriptionUrl,
        loading,
        error,
    };
}
