import Navbar from "~/components/Navbar";
import Chatbot from "~/components/Chatbot";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Chat - MediScan AI" },
    { name: "description", content: "Ask questions about your prescription" },
  ];
}

export default function ChatPage() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section py-16">
        <div className="max-w-2xl mx-auto">
          <Chatbot />
        </div>
      </section>
    </main>
  );
}
