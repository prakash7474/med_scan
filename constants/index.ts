export const prescriptions: Prescription[] = [
    {
        id: "1",
        patientName: "Alice Johnson",
        doctorName: "Dr. Smith",
        imagePath: "/images/prescription_01.png",
        prescriptionPath: "/prescriptions/prescription-1.pdf",
        feedback: {
            overallScore: 85,
            medications: {
                score: 90,
                tips: [],
            },
            dosage: {
                score: 90,
                tips: [],
            },
            instructions: {
                score: 90,
                tips: [],
            },
            sideEffects: {
                score: 90,
                tips: [],
            },
            lifestyle: {
                score: 90,
                tips: [],
            },
            healthCompliance: {
                score: 85,
                tips: [],
            },
        },
    },
    {
        id: "2",
        patientName: "Jane Smith",
        doctorName: "Dr. Johnson",
        imagePath: "/images/prescription_02.png",
        prescriptionPath: "/prescriptions/prescription-2.pdf",
        feedback: {
            overallScore: 55,
            medications: {
                score: 90,
                tips: [],
            },
            dosage: {
                score: 90,
                tips: [],
            },
            instructions: {
                score: 90,
                tips: [],
            },
            sideEffects: {
                score: 90,
                tips: [],
            },
            lifestyle: {
                score: 90,
                tips: [],
            },
            healthCompliance: {
                score: 55,
                tips: [],
            },
        },
    },
    {
        id: "3",
        patientName: "Bob Wilson",
        doctorName: "Dr. Lee",
        imagePath: "/images/prescription_03.png",
        prescriptionPath: "/prescriptions/prescription-3.pdf",
        feedback: {
            overallScore: 75,
            medications: {
                score: 90,
                tips: [],
            },
            dosage: {
                score: 90,
                tips: [],
            },
            instructions: {
                score: 90,
                tips: [],
            },
            sideEffects: {
                score: 90,
                tips: [],
            },
            lifestyle: {
                score: 90,
                tips: [],
            },
            healthCompliance: {
                score: 75,
                tips: [],
            },
        },
    },
];

export const prepareInstructions = ({patientName, doctorName, symptoms}: { patientName: string; doctorName: string; symptoms: string; }) =>
        `You are an expert in prescription analysis and healthcare advice.
Please analyze the provided prescription image/text and return a structured JSON object that strictly follows the 'Feedback' interface shown below (do not add any extra properties or wrapper text):

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

Scoring guidance:
- Use 0-100 numeric scores for each category.
- Be honest and specific: lower scores are acceptable when issues are present.
- If information is missing (e.g. dose not specified), reflect that in the score and tips.

Content guidance:
- For each category, provide 2-4 tips. Use type "good" for positive observations and type "improve" for actionable suggestions.
- Include explanation text for "improve" tips describing why and how to improve.

Context (use when helpful):
Patient name: ${patientName}
Doctor name: ${doctorName}
Symptoms / context: ${symptoms}

Return only valid JSON (no markdown, no backticks, no commentary).`;
