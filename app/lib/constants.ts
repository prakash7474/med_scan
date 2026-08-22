// Shared constants used across the application

/** User scope key for Puter KV storage */
export const USER_KEY = 'user';

/** KV key prefixes */
export const KV_KEYS = {
    PRESCRIPTION: 'prescription',
    MEDICINE: 'medicines',
    SETTINGS: 'settings',
    SIDE_EFFECT: 'side_effects',
} as const;

/** Build a KV key with user scoping */
export function kvKey(prefix: string, suffix: string = USER_KEY): string {
    return `${prefix}:${suffix}`;
}

/** Build a prescription KV key */
export function prescriptionKey(id: string): string {
    return `${KV_KEYS.PRESCRIPTION}:${id}`;
}

/** Build a pattern for listing all prescriptions */
export const PRESCRIPTION_LIST_PATTERN = `${KV_KEYS.PRESCRIPTION}:*`;

/** File type validation */
export const ACCEPTED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp'],
} as const;

/** Max file size: 20MB */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/** Supported file extensions for display */
export const SUPPORTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
