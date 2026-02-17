import Licenses from "@/src/features/loan_licenses/Licenses";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

export default function LicensesPage() {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                <Licenses />
            </main>
            <Footer />
        </div>
    );
}