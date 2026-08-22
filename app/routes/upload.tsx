import {type FormEvent} from 'react'
import Navbar from "~/components/Navbar";
import PrescriptionUploader from "~/components/PrescriptionUploader";
import UploadProgress from "~/components/ui/UploadProgress";
import {useNavigate} from "react-router";
import {useUpload} from "~/hooks/useUpload";

const Upload = () => {
    const navigate = useNavigate();
    const { isProcessing, statusText, currentStep, error, file, setFile, analyze } = useUpload();

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const patientName = formData.get('patient-name') as string;
        const doctorName = formData.get('doctor-name') as string;
        const symptoms = formData.get('symptoms') as string;

        if(!file) return;

        const prescriptionId = await analyze({ patientName, doctorName, symptoms, file });
        if (prescriptionId) {
            navigate(`/prescription/${prescriptionId}`);
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>MediScan AI - Prescription Analysis</h1>
                    {isProcessing ? (
                        <UploadProgress currentStep={currentStep} statusText={statusText} error={error} />
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
