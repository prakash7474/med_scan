import { usePuterStore } from '~/lib/puter';
import { kvKey, KV_KEYS } from '~/lib/constants';
import type { Medicine } from '~/types';

/**
 * Medicine Service
 * Handles medicine reminder CRUD operations via Puter.js KV storage.
 */

function getStore() {
    return usePuterStore.getState();
}

/** Load all saved medicines */
export async function loadMedicines(): Promise<Medicine[]> {
    const { kv } = getStore();
    try {
        const data = await kv.get(kvKey(KV_KEYS.MEDICINE));
        if (!data) return [];
        return JSON.parse(data) as Medicine[];
    } catch (error) {
        console.error('Failed to load medicines:', error);
        return [];
    }
}

/** Save the full medicines list */
export async function saveMedicines(medicines: Medicine[]): Promise<void> {
    const { kv } = getStore();
    await kv.set(kvKey(KV_KEYS.MEDICINE), JSON.stringify(medicines));
}

/** Add a single medicine */
export async function addMedicine(medicine: Medicine): Promise<Medicine[]> {
    const existing = await loadMedicines();
    const updated = [...existing, medicine];
    await saveMedicines(updated);
    return updated;
}

/** Remove a medicine by index */
export async function removeMedicine(index: number): Promise<Medicine[]> {
    const existing = await loadMedicines();
    const updated = existing.filter((_, i) => i !== index);
    await saveMedicines(updated);
    return updated;
}

/** Toggle a medicine's enabled state */
export async function toggleMedicine(index: number): Promise<Medicine[]> {
    const existing = await loadMedicines();
    if (index < 0 || index >= existing.length) return existing;
    existing[index] = { ...existing[index], enabled: !existing[index].enabled };
    await saveMedicines(existing);
    return existing;
}

/** Enable all medicines */
export async function enableAllMedicines(): Promise<Medicine[]> {
    const existing = await loadMedicines();
    const updated = existing.map((m) => ({ ...m, enabled: true }));
    await saveMedicines(updated);
    return updated;
}

/** Extract medicine names from prescription AI response text */
export function extractMedicinesFromAIResponse(aiResponse: string): string[] {
    if (!aiResponse) return [];
    const matches = aiResponse.match(/([A-Z][a-z]+(?:\s+[0-9]+(?:mg|g|ml))?)/g);
    return matches ? [...new Set(matches.map((m) => m.trim()))] : [];
}
