import { type FormEvent, useState } from 'react';
import Navbar from "~/components/Navbar";
import PrescriptionUploader from "~/components/PrescriptionUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // Check authentication and redirect if not authenticated
    if (!isLoading && !auth.isAuthenticated) {
        navigate('/auth?next=/home');
        return null;
    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({ patientName, doctorName, symptoms, file }: { patientName: string; doctorName: string; symptoms: string; file: File }) => {
        setIsProcessing(true);
        setStatusText('Uploading the file...');

        let uploadedFile: any = null;
        let uploadedImage: any = null;
        let uuid = generateUUID();
        let feedbackData: any = null;
        let aiResponse = '';

        try {
            uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error('Failed to upload file');

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) throw new Error('Failed to convert PDF to image');

            setStatusText('Uploading the image...');
            uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error('Failed to upload image');

            setStatusText('Analyzing...');
            const feedbackPromise = ai.feedback(
                uploadedImage.path,
                prepareInstructions({ patientName, doctorName, symptoms })
            );

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Analysis timeout')), 30000)
            );

            const feedback: any = await Promise.race([feedbackPromise, timeoutPromise]);

            console.log('AI feedback response:', feedback);

            if (!feedback || !feedback.message) throw new Error('No feedback received');

            let feedbackText = '';
            if (typeof feedback.message.content === 'string') {
                feedbackText = feedback.message.content;
            } else if (Array.isArray(feedback.message.content) && feedback.message.content.length > 0) {
                const firstContent = feedback.message.content[0];
                if (typeof firstContent === 'string') {
                    feedbackText = firstContent;
                } else if (firstContent && typeof firstContent.text === 'string') {
                    feedbackText = firstContent.text;
                } else {
                    throw new Error('Invalid feedback content structure');
                }
            } else {
                // Handle case where content might be directly in feedback object
                if (typeof feedback.content === 'string') {
                    feedbackText = feedback.content;
                } else if (Array.isArray(feedback.content) && feedback.content.length > 0) {
                    const firstContent = feedback.content[0];
                    if (typeof firstContent === 'string') {
                        feedbackText = firstContent;
                    } else if (firstContent && typeof firstContent.text === 'string') {
                        feedbackText = firstContent.text;
                    } else {
                        throw new Error('Invalid feedback content structure');
                    }
                } else {
                    throw new Error('Invalid feedback content type');
                }
            }

            feedbackData = JSON.parse(feedbackText);
            aiResponse = feedbackText;
        } catch (error) {
            console.error('Analysis failed:', error);
            // Create default feedback if AI analysis fails
            feedbackData = {
                overallScore: 0,
                medications: { score: 0, tips: [] },
                dosage: { score: 0, tips: [] },
                instructions: { score: 0, tips: [] },
                sideEffects: { score: 0, tips: [] },
                lifestyle: { score: 0, tips: [] },
                healthCompliance: { score: 0, tips: [] },
            };
            aiResponse = `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }

        // Always save data and navigate, even on error
        const data = {
            id: uuid,
            prescriptionPath: uploadedFile?.path || '',
            imagePath: uploadedImage?.path || '',
            patientName,
            doctorName,
            symptoms,
            feedback: feedbackData,
            aiResponse,
        };

        await kv.set(`prescription:${uuid}`, JSON.stringify(data));
        setStatusText('Redirecting...');
        console.log(data);
        navigate(`/prescription/${uuid}`);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const patientName = formData.get('patient-name') as string;
        const doctorName = formData.get('doctor-name') as string;
        const symptoms = formData.get('symptoms') as string;

        if (!file) {
            setStatusText('Please select a file first.');
            return;
        }

        handleAnalyze({ patientName, doctorName, symptoms, file });
    };

    const triggerFileInput = () => {
        const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        input?.click();
    };
    

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>MediScan AI - Prescription Analysis</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <div className="flex flex-col items-center justify-center p-8">
                                <p className="text-gray-500 text-lg">Processing your prescription...</p>
                            </div>
                        </>
                    ) : (
                        <h2>Upload your doctor's prescription for instant analysis</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="patient-name">Patient Name</label>
                                <input
                                    type="text"
                                    name="patient-name"
                                    placeholder="Patient Name"
                                    id="patient-name"
                                    required
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="doctor-name">Doctor Name</label>
                                <input
                                    type="text"
                                    name="doctor-name"
                                    placeholder="Doctor Name"
                                    id="doctor-name"
                                    required
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="symptoms">Symptoms/Notes</label>
                                <textarea
                                    rows={5}
                                    name="symptoms"
                                    placeholder="Describe symptoms or additional notes"
                                    id="symptoms"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Prescription</label>
                                <PrescriptionUploader onFileSelect={handleFileSelect} />
                                <div className="flex gap-4 mt-4">
                                    <button
                                        type="button"
                                        className="primary-button flex-1"
                                        onClick={triggerFileInput}
                                    >
                                        📷 Take Photo
                                    </button>
                                    <button
                                        type="button"
                                        className="primary-button flex-1"
                                        onClick={triggerFileInput}
                                    >
                                        📁 Choose File
                                    </button>
                                </div>
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Prescription
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
