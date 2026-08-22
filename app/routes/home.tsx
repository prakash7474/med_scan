import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import PrescriptionCard from "~/components/PrescriptionCard";
import { Link } from "react-router";
import { usePrescriptions } from "~/hooks/usePrescriptions";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import ErrorMessage from "~/components/ui/ErrorMessage";
import EmptyState from "~/components/ui/EmptyState";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MediScan AI - Smart Prescription AI" },
    { name: "description", content: "AI-powered prescription analysis and health insights!" },
  ];
}

export default function Home() {
  const { prescriptions, loading, error, refresh, isEmpty } = usePrescriptions();

  // Apply saved theme preference
  if (typeof window !== 'undefined') {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover transition-all duration-300">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="text-black dark:text-white">Smart Prescription AI</h1>
          {isEmpty ? (
            <h2 className="text-dark-200 dark:text-gray-200">Scan. Understand. Stay Healthy.</h2>
          ) : (
            <h2 className="text-dark-200 dark:text-gray-200">Review your prescriptions and check AI-powered health feedback.</h2>
          )}
        </div>

        {loading && <LoadingSpinner message="Loading your prescriptions..." />}

        {error && <ErrorMessage message={error} onRetry={refresh} />}

        {!loading && !error && isEmpty && (
          <EmptyState
            icon="📤"
            title="No prescriptions yet"
            description="Upload your first prescription to start building your medical history."
            actionLabel="Upload Prescription"
            actionTo="/upload"
          />
        )}

        {!loading && !error && !isEmpty && (
          <div className="prescriptions-section">
            {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
