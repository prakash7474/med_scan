import Navbar from "~/components/Navbar";
import LifestyleTips from "~/components/LifestyleTips";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lifestyle Tips - MediScan AI" },
    { name: "description", content: "Personalized health and wellness tips" },
  ];
}

export default function LifestylePage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section py-16">
        <div className="max-w-4xl mx-auto">
          <LifestyleTips />
        </div>
      </section>
    </main>
  );
}
