// Re-export from the main types file for backward compatibility
// These ambient declarations are kept for components that haven't migrated yet

interface Prescription {
    id: string;
    patientName?: string;
    doctorName?: string;
    symptoms?: string;
    imagePath: string;
    prescriptionPath: string;
    feedback: Feedback;
    aiResponse?: string;
    status?: string;
    uploadedAt?: string;
}

interface Feedback {
    medications: ScoredCategory;
    dosage: ScoredCategory;
    instructions: ScoredCategory;
    sideEffects: ScoredCategory;
    lifestyle: ScoredCategory;
    healthCompliance: ScoredCategory;
}

interface ScoredCategory {
    score: number;
    tips: AnalysisTip[];
}

interface AnalysisTip {
    type: "good" | "improve";
    tip: string;
    explanation?: string;
}
