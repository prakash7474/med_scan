interface Prescription {
    id: string;
    patientName?: string;
    doctorName?: string;
    imagePath: string;
    prescriptionPath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    medications: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation?: string;
        }[];
    };
    dosage: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation?: string;
        }[];
    };
    instructions: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation?: string;
        }[];
    };
    sideEffects: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation?: string;
        }[];
    };
    lifestyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation?: string;
        }[];
    };
    healthCompliance: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
}
