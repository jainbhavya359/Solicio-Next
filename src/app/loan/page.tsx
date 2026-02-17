import Loan from "@/src/components/Loan";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

export default function loanPage() {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                <Loan />
            </main>
            <Footer />
        </div>
    );
}