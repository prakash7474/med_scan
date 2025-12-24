import type { Route } from "./+types/reminders";
import Navbar from "~/components/Navbar";
import MedicineReminder from "~/components/MedicineReminder";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Medicine Reminders - MediScan AI" },
    { name: "description", content: "Manage your medicine reminders" },
  ];
}

export default function RemindersPage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section py-20">
        <div className="max-w-2xl mx-auto">
          <MedicineReminder />
        </div>
      </section>
    </main>
  );
}
