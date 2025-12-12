import Navbar from "~/components/Navbar";
import ReportSummary from "~/components/ReportSummary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Report - MediScan AI" },
    { name: "description", content: "Download your prescription analysis report" },
  ];
}

export default function ReportPage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section py-16">
        <div className="max-w-2xl mx-auto">
          <ReportSummary />
        </div>
      </section>
    </main>
  );
}
