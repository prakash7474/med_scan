import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import PrescriptionUploader from "~/components/PrescriptionUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ patientName, doctorName, symptoms, file }: { patientName: string, doctorName: string, symptoms: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            prescriptionPath: uploadedFile.path,
            imagePath: uploadedImage.path,
            patientName, doctorName, symptoms,
            feedback: '',
        }
        await kv.set(`prescription:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedImage.path,
            prepareInstructions({ patientName, doctorName, symptoms })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze prescription');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        try {
            // Extract JSON from markdown code block if present
            let jsonText = feedbackText;
            if (feedbackText.includes('```json')) {
                const jsonMatch = feedbackText.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    jsonText = jsonMatch[1];
                }
            }
            data.feedback = JSON.parse(jsonText);
            await kv.set(`prescription:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/prescription/${uuid}`);
        } catch (error) {
            console.error('Failed to parse feedback JSON:', feedbackText, error);
            setStatusText('Error: Failed to parse feedback from AI');
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const patientName = formData.get('patient-name') as string;
        const doctorName = formData.get('doctor-name') as string;
        const symptoms = formData.get('symptoms') as string;

        if(!file) return;

        handleAnalyze({ patientName, doctorName, symptoms, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>MediScan AI - Prescription Analysis</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            
                        </>
                    ) : (
                        <h2>Upload your doctor's prescription for instant analysis</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="patient-name">Patient Name</label>
                                <input type="text" name="patient-name" placeholder="Patient Name" id="patient-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="doctor-name">Doctor Name</label>
                                <input type="text" name="doctor-name" placeholder="Doctor Name" id="doctor-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="symptoms">Symptoms/Notes</label>
                                <textarea rows={5} name="symptoms" placeholder="Symptoms/Notes" id="symptoms" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Prescription</label>
                                <PrescriptionUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Prescription
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
