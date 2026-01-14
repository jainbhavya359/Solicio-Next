import Services from "@/src/components/Services";
import {Service_data} from "@/src/utils/store"

export default function ServicesPage(){
    return(
        <section className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
            <Services service_data={Service_data}/>
        </section>
    );
}