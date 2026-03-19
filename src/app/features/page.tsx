import Services from "@/src/components/Services";
import { Service_data } from "@/src/utils/store"

export default function ServicesPage() {
    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased transition-colors duration-300">
            <Services service_data={Service_data} />
        </div>
    );
}