import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import HealthCompliance from "~/components/HealthCompliance";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'MediScan AI | Prescription Review' },
    { name: 'description', content: 'Detailed overview of your prescription' },
])

const Prescription = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [prescriptionUrl, setPrescriptionUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/prescription/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadPrescription = async () => {
            const prescription = await kv.get(`prescription:${id}`);

            if(!prescription) return;

            const data = JSON.parse(prescription);

            const prescriptionBlob = await fs.read(data.prescriptionPath);
            if(!prescriptionBlob) return;

            const pdfBlob = new Blob([prescriptionBlob], { type: 'application/pdf' });
            const prescriptionUrl = URL.createObjectURL(pdfBlob);
            setPrescriptionUrl(prescriptionUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);

        }

        loadPrescription();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="prescription-nav">
                <Link to="/" className="back-button">
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
                    <h2 className="text-4xl !text-black font-bold">Prescription Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <HealthCompliance score={feedback.healthCompliance.score} suggestions={feedback.healthCompliance.tips} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/pdf.png" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Prescription
