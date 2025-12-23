export const prescriptions: Prescription[] = [
    {
        id: "1",
        patientName: "Alice Johnson",
        doctorName: "Dr. Smith",
        imagePath: "/images/prescription_01.png",
        prescriptionPath: "/prescriptions/prescription-1.pdf",
        feedback: {
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
    `You are MediScan AI, a healthcare prescription analyzer. Analyze the uploaded prescription document and provide a comprehensive health assessment.

**SCORING GUIDELINES:**
- Score 90-100: Excellent - No issues, optimal choices
- Score 70-89: Good - Minor concerns, generally safe
- Score 50-69: Moderate - Some issues requiring attention
- Score 30-49: Poor - Significant concerns, medical review needed
- Score 0-29: Critical - Serious issues, immediate medical attention required

**ANALYSIS REQUIREMENTS:**
1. **medications**: Evaluate drug appropriateness, interactions, allergies, contraindications
2. **dosage**: Check dosing accuracy, frequency, duration, age-appropriate dosing
3. **instructions**: Assess clarity, completeness, patient understanding requirements
4. **sideEffects**: Identify potential adverse effects, monitoring needs, risk factors
5. **lifestyle**: Evaluate impact on diet, exercise, daily activities, quality of life
6. **healthCompliance**: Assess ease of adherence, cost factors, accessibility, patient barriers

**OUTPUT FORMAT:**
Return ONLY a valid JSON object in this exact format:
{
  "medications": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Clear medication description", "explanation": "Detailed reasoning"},
      {"type": "improve", "tip": "Consider drug interactions", "explanation": "Specific recommendations"}
    ]
  },
  "dosage": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Appropriate dosing schedule", "explanation": "Why this is optimal"},
      {"type": "improve", "tip": "Review dosage for age/weight", "explanation": "Adjustment recommendations"}
    ]
  },
  "instructions": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Clear administration instructions", "explanation": "Patient-friendly guidance"},
      {"type": "improve", "tip": "Add food timing instructions", "explanation": "When to take with/without food"}
    ]
  },
  "sideEffects": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Minimal side effect risk", "explanation": "Low-risk medication profile"},
      {"type": "improve", "tip": "Monitor for common side effects", "explanation": "What to watch for and when to report"}
    ]
  },
  "lifestyle": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Compatible with daily activities", "explanation": "Minimal lifestyle disruption"},
      {"type": "improve", "tip": "Adjust exercise routine", "explanation": "Activity modifications needed"}
    ]
  },
  "healthCompliance": {
    "score": 0-100,
    "tips": [
      {"type": "good", "tip": "Easy to follow regimen", "explanation": "Simple dosing schedule"},
      {"type": "improve", "tip": "Consider adherence aids", "explanation": "Pill organizers, reminders, or support"}
    ]
  }
}

**PATIENT CONTEXT:**
- Patient: ${patientName}
- Doctor: ${doctorName}
- Symptoms/Notes: ${symptoms}

**IMPORTANT:** Focus on patient safety, provide actionable recommendations, and ensure scores reflect real medical significance. Do not include any text before or after the JSON.`;
  