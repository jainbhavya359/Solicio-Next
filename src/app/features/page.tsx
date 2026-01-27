import Services from "@/src/components/Services";
import {Service_data} from "@/src/utils/store"

export default function ServicesPage(){
    return(
        <div className="bg-white text-slate-900 antialiased">
            <Services service_data={Service_data}/>
        </div>
    );
}