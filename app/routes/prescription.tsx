import { Link, useParams } from "react-router";
import { useState } from "react";
import { usePrescription } from "~/hooks/usePrescriptions";
import LifestyleTips from "~/components/LifestyleTips";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import ErrorMessage from "~/components/ui/ErrorMessage";
import StatusBadge from "~/components/ui/StatusBadge";

export const meta = () => ([
    { title: 'MediScan AI | Prescription Review' },
    { name: 'description', content: 'Detailed overview of your prescription' },
])

const Prescription = () => {
    const { id } = useParams();
    const { prescription, imageUrl, prescriptionUrl, loading, error } = usePrescription(id);
    const [showLifestyle, setShowLifestyle] = useState(false);

    if (loading) {
        return (
            <main className="!pt-0">
                <nav className="prescription-nav">
                    <Link to="/home" className="back-button">
                        <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                    </Link>
                </nav>
                <LoadingSpinner message="Loading prescription..." />
            </main>
        );
    }

    if (error || !prescription) {
        return (
            <main className="!pt-0">
                <nav className="prescription-nav">
                    <Link to="/home" className="back-button">
                        <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                    </Link>
                </nav>
                <ErrorMessage
                    title="Error Loading Prescription"
                    message={error || 'Prescription not found.'}
                    onRetry={() => window.location.reload()}
                />
            </main>
        );
    }

    const feedback = prescription.feedback;

    return (
        <main className="!pt-0">
            <nav className="prescription-nav">
                <Link to="/home" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && prescriptionUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={prescriptionUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    alt="prescription"
                                    title="prescription"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl !text-black font-bold">Prescription Review</h2>
                        {feedback && (
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-3">Explore More</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowLifestyle(!showLifestyle)}>
                                        <img src="/images/lifestyle.png" alt="Lifestyle Tips" className="w-6 h-6" />
                                        <span className="text-sm font-medium">Lifestyle Tips</span>
                                    </div>
                                    <Link to="/how-it-works" className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm text-center">
                                        How It Works
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {feedback ? (
                        <div className="animate-in fade-in duration-1000">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">AI Analysis Results</h3>
                                <div className="space-y-4">
                                    {Object.entries(feedback).map(([category, data]: [string, any]) => (
                                        <div key={category} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold capitalize text-lg">{category.replace(/([A-Z])/g, ' $1')}</h4>
                                                <StatusBadge score={data.score} showLabel />
                                            </div>
                                            <div className="space-y-2">
                                                {data.tips?.map((tip: any, index: number) => (
                                                    <div key={index} className={`p-3 rounded border-l-4 ${tip.type === 'good' ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                                                        <div className="font-medium text-sm">{tip.type === 'good' ? '✅' : '⚠️'} {tip.tip}</div>
                                                        {tip.explanation && <div className="text-sm text-gray-600 mt-1">{tip.explanation}</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8">
                            <p className="text-gray-500 text-lg">No analysis available for this prescription.</p>
                        </div>
                    )}
                </section>
            </div>

            {showLifestyle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                        <button
                            onClick={() => setShowLifestyle(false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                        >
                            ×
                        </button>
                        <LifestyleTips aiResponse={prescription.aiResponse} />
                    </div>
                </div>
            )}
        </main>
    );
};

export default Prescription;
