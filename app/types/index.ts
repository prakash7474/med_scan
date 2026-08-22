// ============================================================
// Core Application Types
// ============================================================

/** Prescription status */
export type PrescriptionStatus = 'uploaded' | 'processing' | 'analyzed' | 'error';

/** Single analysis tip */
export interface AnalysisTip {
    type: 'good' | 'improve';
    tip: string;
    explanation?: string;
}

/** Scored category with tips */
export interface ScoredCategory {
    score: number;
    tips: AnalysisTip[];
}

/** Full AI feedback from prescription analysis */
export interface Feedback {
    medications: ScoredCategory;
    dosage: ScoredCategory;
    instructions: ScoredCategory;
    sideEffects: ScoredCategory;
    lifestyle: ScoredCategory;
    healthCompliance: ScoredCategory;
}

/** Prescription record stored in Puter KV */
export interface Prescription {
    id: string;
    patientName?: string;
    doctorName?: string;
    symptoms?: string;
    imagePath: string;
    prescriptionPath: string;
    feedback: Feedback;
    aiResponse?: string;
    status?: PrescriptionStatus;
    uploadedAt?: string;
}

/** Medicine reminder record */
export interface Medicine {
    name: string;
    dosage: string;
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    enabled: boolean;
}

/** Side effect journal entry */
export interface SideEffectEntry {
    id: string;
    date: string;
    symptom: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    createdAt: string;
}

/** App settings */
export interface AppSettings {
    darkMode: boolean;
    language: string;
    notifications: boolean;
    medicineReminders: boolean;
    reportUpdates: boolean;
    emergencyAlerts: boolean;
    privacy: boolean;
    autoBackup: boolean;
    dataRetention: string;
    emailAlerts: boolean;
    soundEnabled: boolean;
}

/** Default settings */
export const DEFAULT_SETTINGS: AppSettings = {
    darkMode: false,
    language: 'English',
    notifications: true,
    medicineReminders: true,
    reportUpdates: true,
    emergencyAlerts: false,
    privacy: true,
    autoBackup: false,
    dataRetention: '1year',
    emailAlerts: false,
    soundEnabled: true,
};

// ============================================================
// Puter.js Types (kept for reference, declared globally in puter.ts)
// ============================================================

// Puter.js types are declared globally in app/lib/puter.ts
// They are available as ambient types throughout the project
