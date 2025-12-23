import {Link} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const PrescriptionCard = ({ prescription: { id, patientName, doctorName, feedback, imagePath } }: { prescription: Prescription }) => {
    const { fs } = usePuterStore();
    const [prescriptionUrl, setPrescriptionUrl] = useState('');

    useEffect(() => {
        const loadPrescription = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setPrescriptionUrl(url);
        }

        loadPrescription();
    }, [imagePath]);

    return (
        <Link to={`/prescription/${id}`} className="prescription-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {patientName && <h2 className="!text-black font-bold break-words">{patientName}</h2>}
                    {doctorName && <h3 className="text-lg break-words text-gray-500">{doctorName}</h3>}
                    {!patientName && !doctorName && <h2 className="!text-black font-bold">Prescription</h2>}
                </div>

            </div>
            {prescriptionUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={prescriptionUrl}
                            alt="prescription"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    </div>
                </div>
                )}
        </Link>
    )
}
export default PrescriptionCard
