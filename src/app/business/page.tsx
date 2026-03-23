import Business from "@/src/components/Business";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

export default function BusinessPage() {
    return (
        <div className="bg-[#050505] min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                <Business />
            </main>
            <Footer />
        </div>
    );
}