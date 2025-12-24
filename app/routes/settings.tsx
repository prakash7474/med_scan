
import type { Route } from "./+types/settings";
import Navbar from "~/components/Navbar";
import ProfileSettings from "~/components/ProfileSettings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - MediScan AI" },
    { name: "description", content: "Manage your account and app settings" },
  ];
}

export default function SettingsPage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] dark:bg-[url('/images/bg-dark-main.svg')] bg-cover min-h-screen transition-all duration-300">
      <Navbar />

      <section className="main-section py-20">
        <div className="max-w-2xl mx-auto">
          <ProfileSettings />
        </div>
      </section>
    </main>
  );
}
