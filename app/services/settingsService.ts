import { usePuterStore } from '~/lib/puter';
import { kvKey, KV_KEYS } from '~/lib/constants';
import type { AppSettings } from '~/types';
import { DEFAULT_SETTINGS } from '~/types';

/**
 * Settings Service
 * Handles app settings persistence via Puter.js KV storage.
 */

function getStore() {
    return usePuterStore.getState();
}

/** Load settings, falling back to defaults */
export async function loadSettings(): Promise<AppSettings> {
    const { kv } = getStore();
    try {
        const data = await kv.get(kvKey(KV_KEYS.SETTINGS));
        if (!data) return DEFAULT_SETTINGS;
        const parsed = typeof data === 'string' ? data : (data as any).value;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(parsed) };
    } catch (error) {
        console.error('Failed to load settings:', error);
        return DEFAULT_SETTINGS;
    }
}

/** Save settings */
export async function saveSettings(settings: AppSettings): Promise<void> {
    const { kv } = getStore();
    await kv.set(kvKey(KV_KEYS.SETTINGS), JSON.stringify(settings));
}

/** Apply dark mode to the DOM */
export function applyDarkMode(enabled: boolean): void {
    if (enabled) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(enabled));
}

/** Load and apply dark mode from localStorage (used on initial render) */
export function initDarkMode(): void {
    const saved = localStorage.getItem('darkMode');
    applyDarkMode(saved === 'true');
}

/** Export all user data as JSON */
export async function exportUserData(): Promise<string> {
    const { kv } = getStore();
    const prescriptions = await kv.list('prescription:*', true);
    const prescriptionData = prescriptions?.map((p: any) =>
        JSON.parse(typeof p === 'string' ? p : p.value)
    ) || [];

    const settings = await kv.get(kvKey(KV_KEYS.SETTINGS));
    const settingsData = settings
        ? JSON.parse(typeof settings === 'string' ? settings : (settings as any).value)
        : null;

    return JSON.stringify({
        exportDate: new Date().toISOString(),
        prescriptions: prescriptionData,
        settings: settingsData,
    }, null, 2);
}

/** Wipe all user data */
export async function wipeAllData(): Promise<void> {
    const { fs, kv } = getStore();

    // Delete all files
    const files = (await fs.readDir('./')) as FSItem[] | undefined;
    if (files) {
        for (const file of files) {
            try { await fs.delete(file.path); } catch { /* ignore */ }
        }
    }

    // Flush all KV data
    await kv.flush();
}
