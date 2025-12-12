import type { Route } from "./+types/how-it-works";
import Navbar from "~/components/Navbar";
import HowItWorks from "~/components/HowItWorks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "How It Works - MediScan AI" },
    { name: "description", content: "Learn how MediScan AI analyzes your prescriptions" },
  ];
}

export default function HowItWorksPage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section py-16">
        <div className="max-w-2xl mx-auto">
          <HowItWorks />
        </div>
      </section>
    </main>
  );
}
