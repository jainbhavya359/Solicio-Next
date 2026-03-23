import Loan from "@/src/components/Loan";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

export default function loanPage() {
    return (
        <div className="bg-[#020202] min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Loan />
            </main>
            <Footer />
        </div>
    );
}