import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';
import { prescriptionKey, PRESCRIPTION_LIST_PATTERN, kvKey, KV_KEYS } from '~/lib/constants';
import type { Prescription, Feedback } from '~/types';

/**
 * Prescription Service
 * Handles all prescription-related operations via Puter.js KV storage.
 */

/** Get the Puter store instance */
function getStore() {
    return usePuterStore.getState();
}

/** List all prescriptions */
export async function listPrescriptions(): Promise<Prescription[]> {
    const { kv } = getStore();
    try {
        const items = (await kv.list(PRESCRIPTION_LIST_PATTERN, true)) as KVItem[] | undefined;
        if (!items || items.length === 0) return [];

        return items
            .map((item) => {
                try {
                    return JSON.parse(item.value) as Prescription;
                } catch {
                    return null;
                }
            })
            .filter((p): p is Prescription => p !== null);
    } catch (error) {
        console.error('Failed to list prescriptions:', error);
        return [];
    }
}

/** Get a single prescription by ID */
export async function getPrescription(id: string): Promise<Prescription | null> {
    const { kv } = getStore();
    try {
        const data = await kv.get(prescriptionKey(id));
        if (!data) return null;
        return JSON.parse(data) as Prescription;
    } catch (error) {
        console.error('Failed to get prescription:', error);
        return null;
    }
}

/** Create a new prescription (stores initial metadata) */
export async function createPrescription(data: {
    patientName?: string;
    doctorName?: string;
    symptoms?: string;
    prescriptionPath: string;
    imagePath: string;
}): Promise<Prescription> {
    const { kv } = getStore();
    const id = generateUUID();

    const prescription: Prescription = {
        id,
        patientName: data.patientName,
        doctorName: data.doctorName,
        symptoms: data.symptoms,
        prescriptionPath: data.prescriptionPath,
        imagePath: data.imagePath,
        feedback: {} as Feedback,
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
    };

    await kv.set(prescriptionKey(id), JSON.stringify(prescription));
    return prescription;
}

/** Update a prescription's feedback after AI analysis */
export async function updatePrescriptionFeedback(
    id: string,
    feedback: Feedback,
    aiResponse?: string
): Promise<void> {
    const { kv } = getStore();
    const existing = await getPrescription(id);
    if (!existing) throw new Error(`Prescription ${id} not found`);

    const updated: Prescription = {
        ...existing,
        feedback,
        aiResponse: aiResponse || existing.aiResponse,
        status: 'analyzed',
    };

    await kv.set(prescriptionKey(id), JSON.stringify(updated));
}

/** Delete a prescription by ID */
export async function deletePrescription(id: string): Promise<void> {
    const { kv, fs } = getStore();
    const prescription = await getPrescription(id);

    if (prescription) {
        // Delete associated files
        try { await fs.delete(prescription.prescriptionPath); } catch { /* ignore */ }
        try { await fs.delete(prescription.imagePath); } catch { /* ignore */ }
    }

    await kv.delete(prescriptionKey(id));
}
