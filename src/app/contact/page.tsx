
import Contact from "@/src/components/Contact";

export const metadata = {
  title: "Contact Us | Solicio",
  description: "Get in touch with us for questions, feedback, or business ideas.",
};

export default async function ContactPage() {
  let faqs = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions`,
    );

    if (res.ok) {
      faqs = await res.json();
    }
  } catch (error) {
    console.error("Failed to load FAQs");
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28 overflow-hidden">
        <Contact faqs={faqs} />
    </div>
  );
}
