import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import PrescriptionCard from "~/components/PrescriptionCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MediScan AI - Smart Prescription AI" },
    { name: "description", content: "AI-powered prescription analysis and health insights!" },
  ];
}

export default function Home() {
  const { auth, kv, puterReady, error } = usePuterStore();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  useEffect(() => {
    if (puterReady && !auth.isAuthenticated) navigate('/auth?next=/home');
  }, [auth.isAuthenticated, puterReady])

  useEffect(() => {
    const loadPrescriptions = async () => {
      if (!puterReady) return;

      setLoadingPrescriptions(true);

      try {
        const prescriptions = (await kv.list('prescription:*', true)) as KVItem[];

        const parsedPrescriptions = prescriptions?.map((prescription) => (
            JSON.parse(prescription.value) as Prescription
        ))

        setPrescriptions(parsedPrescriptions || []);
      } catch (error) {
        console.error('Failed to load prescriptions:', error);
        setPrescriptions([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    }

    if (puterReady) {
      loadPrescriptions()
    }
  }, [puterReady]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Smart Prescription AI</h1>
        {!loadingPrescriptions && prescriptions?.length === 0 ? (
            <h2>Scan. Understand. Stay Healthy.</h2>
        ): (
          <h2>Review your prescriptions and check AI-powered health feedback.</h2>
        )}
      </div>
      {loadingPrescriptions && (
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-gray-500 text-lg">Loading your prescriptions...</p>
            </div>
          </div>
      )}

      {!loadingPrescriptions && prescriptions.length > 0 && (
        <div className="prescriptions-section">
          {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
        </div>
      )}

      {!loadingPrescriptions && prescriptions?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Prescription
            </Link>
          </div>
      )}
    </section>
  </main>
}
