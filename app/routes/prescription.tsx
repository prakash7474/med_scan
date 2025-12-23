import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import LifestyleTips from "~/components/LifestyleTips";

export const meta = () => ([
    { title: 'MediScan AI | Prescription Review' },
    { name: 'description', content: 'Detailed overview of your prescription' },
])

const Prescription = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [prescriptionUrl, setPrescriptionUrl] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [feedback, setFeedback] = useState<any>(null);
    const [showLifestyle, setShowLifestyle] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/home');
    }, [isLoading])

    useEffect(() => {
        const loadPrescription = async () => {
            console.log('Loading prescription with ID:', id);
            const prescription = await kv.get(`prescription:${id}`);

            if(!prescription) {
                console.error('No prescription found for ID:', id);
                return;
            }

            const data = JSON.parse(prescription);
            console.log('Parsed prescription data:', data);

            const prescriptionBlob = await fs.read(data.prescriptionPath);
            if(!prescriptionBlob) {
                console.error('Failed to read prescription file');
                return;
            }

            const pdfBlob = new Blob([prescriptionBlob], { type: 'application/pdf' });
            const prescriptionUrl = URL.createObjectURL(pdfBlob);
            setPrescriptionUrl(prescriptionUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) {
                console.error('Failed to read image file');
                return;
            }
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            console.log('Setting feedback:', data.feedback);
            setFeedback(data.feedback);
            setAiResponse(data.aiResponse || '');

        }

        loadPrescription();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="prescription-nav">
                <Link to="/home" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && prescriptionUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={prescriptionUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
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
                                        <img
                                            src="/images/lifestyle.png"
                                            alt="Lifestyle Tips"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-sm font-medium">Lifestyle Tips</span>
                                    </div>
                                    <Link to="/how-it-works" className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm text-center">
                                        How It Works
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    {error ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <h3 className="text-red-600 text-xl font-semibold mb-4">Error Loading Prescription</h3>
                            <p className="text-red-500 text-lg mb-4">{error}</p>
                            <button
                                className="primary-button"
                                onClick={() => window.location.reload()}
                            >
                                Retry Loading
                            </button>
                        </div>
                    ) : feedback ? (
                        <div className="animate-in fade-in duration-1000">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-4">AI Analysis Results</h3>
                                <div className="space-y-4">
                                    {Object.entries(feedback).map(([category, data]: [string, any]) => (
                                        <div key={category} className="border rounded-lg p-4">
                                            <h4 className="font-semibold capitalize text-lg mb-2">{category.replace(/([A-Z])/g, ' $1')}</h4>
                                            <div className="mb-2">
                                                <span className="font-medium">Score: </span>
                                                <span className={`px-2 py-1 rounded text-sm ${data.score >= 80 ? 'bg-green-100 text-green-800' : data.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {data.score}/100
                                                </span>
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
                            <p className="text-gray-500 text-lg">Loading prescription analysis...</p>
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
                        <LifestyleTips aiResponse={aiResponse} />
                    </div>
                </div>
            )}
        </main>
    )
}
export default Prescription
