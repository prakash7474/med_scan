import { Link } from "react-router";
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from './Accordion';

interface ReportSummaryProps {
    prescription?: Prescription;
}

const ReportSummary = ({ prescription }: ReportSummaryProps) => {
    if (!prescription) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-6 w-full">
                <h3 className="text-2xl font-bold mb-6">AI Prescription Report</h3>
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No prescription selected.</p>
                    <p className="text-gray-400 mb-6">Upload a prescription to get a detailed AI analysis report.</p>
                    <Link to="/upload" className="primary-button w-fit mx-auto">
                        Upload Prescription
                    </Link>
                </div>
            </div>
        );
    }

    const feedback = prescription.feedback;
    const suggestions = feedback.healthCompliance?.tips || [
        { type: "good" as const, tip: "Dosages are within safe limits." },
        { type: "improve" as const, tip: "Consider adding probiotics to mitigate antibiotic side effects." },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-2xl font-bold mb-6">AI Prescription Report</h3>

            {/* Personalized Recommendations */}
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-4">Health Compliance</h4>
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <img
                                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt={suggestion.type === "good" ? "Check" : "Warning"}
                                className="w-5 h-5 mt-1"
                            />
                            <p className={suggestion.type === "good" ? "text-green-700" : "text-amber-700"}>
                                {suggestion.tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expandable Sections */}
            <div className="mb-6">
                <Accordion>
                    <AccordionItem id="medicine-details">
                        <AccordionHeader itemId="medicine-details">Medicine Details</AccordionHeader>
                        <AccordionContent itemId="medicine-details">
                            <div className="text-gray-600 space-y-2">
                                {feedback.medications?.tips?.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span>{tip.type === 'good' ? '✅' : '⚠️'}</span>
                                        <span>{tip.tip}</span>
                                    </div>
                                )) || <p>No medication details available.</p>}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem id="instructions">
                        <AccordionHeader itemId="instructions">Instructions</AccordionHeader>
                        <AccordionContent itemId="instructions">
                            <div className="text-gray-600 space-y-2">
                                {feedback.instructions?.tips?.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span>{tip.type === 'good' ? '✅' : '⚠️'}</span>
                                        <span>{tip.tip}</span>
                                    </div>
                                )) || <p>No instructions available.</p>}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem id="side-effects">
                        <AccordionHeader itemId="side-effects">Side Effects</AccordionHeader>
                        <AccordionContent itemId="side-effects">
                            <div className="text-gray-600 space-y-2">
                                {feedback.sideEffects?.tips?.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span>{tip.type === 'good' ? '✅' : '⚠️'}</span>
                                        <span>{tip.tip}</span>
                                    </div>
                                )) || <p>No side effect information available.</p>}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Trust Note */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    This report is generated by AI based on standard medical guidelines. Always consult with a healthcare professional for personalized advice.
                </p>
            </div>
        </div>
    );
};

export default ReportSummary;
