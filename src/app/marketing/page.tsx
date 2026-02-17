import Marketing from "@/src/components/Marketing";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

export default function MarketingPage() {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                <Marketing />
            </main>
            <Footer />
        </div>
    );
}